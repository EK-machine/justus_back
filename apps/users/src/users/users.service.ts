import { CreateUserDto, DeleteUserDto, UpdateUserDto, UserLoginDto } from '@app/contracts/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { ILoginResp, IUser, IUserData } from 'libs/types/user.types';
import { IRmqResp } from 'libs/types/base.types';
import * as bcrypt from 'bcrypt'; 
import { AtRtService } from '../atRt/at_rt.service';
import { ERRORR_MSGS, userDoesNotExists, userExists } from 'libs/consts/error.msgs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly atRtService: AtRtService,
    private readonly dataSource: DataSource,
  ) {}
  async get(): Promise<IRmqResp<IUserData[] | null>> {
    try {
      const users = await this.userRepo.find();
      const payload = users.map(({password, ...rest}) => rest);
      return { payload };
    } catch (error) {
      return { payload: null, errors: ['пользователи не найдены'] };
    }
  }

  async getById(id: number): Promise<IRmqResp<IUserData | null>> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id
        }
      });

      if(!user) {
        return { payload: null, errors: [`пользователь с id ${id} не найден`] };
      }
      const  { password, ...rest } = user;
      return { payload: rest };
    } catch (error) {
      return { payload: null, errors: [`пользователь с id ${id} не найден`] };
    }
  }

  async create(dto: CreateUserDto): Promise<IRmqResp<{id: number} | null>> {
    try {
      const usersRmqResp = await this.get();
      if(usersRmqResp.errors && usersRmqResp.errors.length > 0) {
        return { payload: null, errors: [`не удалось проверить наличие в системе пользователя с email ${dto.email}`] };
      }
      if(usersRmqResp.payload) {
        const oldUser = usersRmqResp.payload.find(({email}) => email === dto.email);
        if(oldUser) {
          return { payload: null, errors: [userExists(dto.email)] };
        }
      }

      const hashedPassword = await this.hashPass(dto.password);
      const newUser = await this.userRepo.save({...dto, password: hashedPassword});
      return { payload: {id: newUser.id} };
    } catch (error) {
      return { payload: null, errors: ['пользователь не создан'] };
    }
  }

  async udate(dto: UpdateUserDto): Promise<IRmqResp<IUserData | null>> {
    try {
      const userRmqResp  = await this.getById(dto.id);
      if(!userRmqResp.payload) {
        return { payload: null, errors: [`пользователя c id ${dto.id} для обновления не существует`] };
      }

      const userToEdit = { ...userRmqResp.payload, ...dto };
      const saved = await this.userRepo.save(userToEdit);
      const { password, ...payload } = saved;
      
      return { payload };
    } catch (error) {
      return { payload: null, errors: [`пользователь с id ${dto.id} не обновлён`] };
    }
  }

  async delete(dto: DeleteUserDto): Promise<IRmqResp<IUser | null>> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: dto.id,
        }
      });

      if(!user) {
        return { payload: null, errors: [`пользователя c id ${dto.id} для удаления не существует`] };
      }

      const deleteResult = await this.userRepo.delete(dto.id);

      if(!deleteResult.affected) {
        return { payload: null, errors: [`пользователя c id ${dto.id} не удалось удалить`] };
      }
      
      return { payload: user };
    } catch (error) {
      return { payload: null, errors: [`пользователя c id ${dto.id} не удалось удалить`] };
    }
  }

  async restore(payload: IUser): Promise<IRmqResp<boolean>> {
    try {
      const userEntity = new UserEntity();
      userEntity.email = payload.email;
      userEntity.name = payload.name;
      userEntity.password = payload.password;

      const oldUser = await this.userRepo.save(userEntity);
      if(!oldUser) {
        return {payload: false, errors: ['не удалось удалить а затем восстановить пользователя']}
      }

      const updateResult = await this.userRepo.update({email: oldUser.email}, {id: payload.id});
      if(!updateResult.affected) {
        return {payload: false, errors: ['не удалось удалить а затем восстановить пользователя']}
      }
      return { payload: true }
    } catch (error) {
      return {payload: false, errors: [error.message]}
    }
  }

  async login(dto: UserLoginDto): Promise<IRmqResp<ILoginResp | null>> {
    try {
      const {password, email} = dto;
      const user = await this.userRepo.findOne({
        where: {
          email
        }
      });
      if (!user) {
        return { payload: null, errors: [userDoesNotExists(email)] };
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return { payload: null, errors: [ERRORR_MSGS.USERS_INCORRECT_CREDS] };
      }

      const atRt = await this.atRtService.getTokens({email: user.email});
      if(atRt.errors && atRt.errors.length > 0) {
        return { payload: null, errors: [atRt.errors[0]] };
      }

      if(!atRt.payload) {
        return { payload: null, errors: [`не удалось войти c email ${dto.email}`] };
      }

      return { payload: {atrt: atRt.payload, userId: user.id } };
    } catch(error) {
      return { payload: null, errors: [`не удалось войти c email ${dto.email}`] };
    }
  }

  async logout(rt: string): Promise<IRmqResp<boolean>> {
    try{
      const verifyData = await this.atRtService.verifyRt(rt);
      if(verifyData.errors && verifyData.errors.length > 0) {
        return { payload: false, errors: verifyData.errors };
      }
      if(!verifyData.payload || verifyData.payload.email.length === 0) {
        return { payload: false, errors: [ERRORR_MSGS.RT_NOT_VERIFIED] };
      }
      const delRes = await this.atRtService.delete(verifyData.payload.email);
      if(delRes.errors && delRes.errors.length > 0) {
        return { payload: false, errors: [delRes.errors[0]] };
      }
      return { payload: true };
    } catch(error) {
      return { payload: false, errors: [`не удалось выйти - проблема с токеном`] };
    }
  }

  async getIdByAt(at: string): Promise<number> {
    try {
      const { email } = await this.atRtService.getAtData(at);
      const user = await this.userRepo.findOne({
        where: {
          email
        }
      });
      if(!user) {
        throw new UnauthorizedException('Пользователя не существует');
      }
      return user.id;
    } catch(error) {
      throw new UnauthorizedException('Авторизируйтесь для продолжения');
    }
  }

  private hashPass(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
