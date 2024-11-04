import { CreateUserDto, DeleteUserDto, UpdateUserDto } from '@app/contracts/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IUserData } from 'libs/types/user.types';
import { IRmqResp } from 'libs/types/base.types';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {}
  async get(): Promise<IRmqResp<IUserData[] | null>> {
    try {
      const users = await this.userRepo.find();
      const payload = users.map(({password, ...rest}) => rest);
      return { payload };
    } catch (error) {
      return { payload: null, errors: ['Пользователи не найдены'] };
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
        return { payload: null, errors: [`Пользователь с id ${id} не найден`] };
      }
      const  { password, ...rest } = user;
      return { payload: rest };
    } catch (error) {
      return { payload: null, errors: [`Пользователь с id ${id} не найден`] };
    }
  }

  async create(dto: CreateUserDto): Promise<IRmqResp<{id: number} | null>> {
    try {
      // todo bycrypt password, create jwt
      const user = new UserEntity();
      user.email = dto.email;
      user.password = dto.password;
      user.name = dto.name;
      user.user_name = dto.user_name;
      const newUser = await this.userRepo.save(user);
      return { payload: {id: newUser.id} };
    } catch (error) {
      return { payload: null, errors: ['Пользователь не создан'] };
    }
  }

  async udate(dto: UpdateUserDto): Promise<IRmqResp<IUserData | null>> {
    try {
      const userToEditData  = await this.getById(dto.id);
      if(!userToEditData.payload) {
        return { payload: null, errors: [`Пользователя c id ${dto.id} для обновления не существует`] };
      }

      const userToEdit = { ...userToEditData.payload, ...dto };
      const saved = await this.userRepo.save(userToEdit);
      const { password, ...payload } = saved;
      
      return { payload };
    } catch (error) {
      return { payload: null, errors: [`Пользователь с id ${dto.id} не обновлён`] };
    }
  }

  async delete(dto: DeleteUserDto): Promise<IRmqResp<boolean>> {
    try {
      const userToDel = await this.getById(dto.id);
      if(!userToDel.payload) {
        return { payload: false, errors: [`Пользователя c id ${dto.id} для удаления не существует`] };
      }

      const deleteResult = await this.userRepo.delete(dto.id);

      if(!deleteResult.affected) {
        return { payload: false, errors: [`Пользователя c id ${dto.id} не удалось удалить`] };
      }
      
      return { payload: true };
    } catch (error) {
      return { payload: false, errors: [`Пользователя c id ${dto.id} не удалось удалить`] };
    }
  }
}
