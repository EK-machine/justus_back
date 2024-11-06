import { USER_CLIENT, USER_MSGS } from '@app/contracts/user';
import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy} from '@nestjs/microservices';
import { IUserData, AtRt } from 'libs/types/user.types';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../dto/user/createUser.dto';
import { IRmqResp } from 'libs/types/base.types';
import { UpdateUserPayload } from '../dto/user/updateUser.dto';
import { CONSTS } from 'libs/consts/validationmsgs';
import { LoginDto } from '../dto/user/login.dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_CLIENT) private readonly userClient: ClientProxy) {}
  async get(): Promise<IUserData[]> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.GET_USERS }, {});
      const data = await firstValueFrom<IRmqResp<IUserData[] | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new NotFoundException(data.errors[0]);
      }
      if(!data.payload) {
        throw new NotFoundException('Пользователи не найдены');
      }

      return data.payload;
    } catch (error) {
      throw new NotFoundException('Пользователи не найдены');
    }
  }

  async getById(id: number): Promise<IUserData> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.GET_USER }, { id });
      const data = await firstValueFrom<IRmqResp<IUserData | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new NotFoundException(data.errors[0]);
      }
      if(!data.payload) {
        throw new NotFoundException(`Пользователь с id ${id} не найден`);
      }
      return data.payload;
    }
    catch (error) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }
  }

  async create(createPayload: CreateUserDto): Promise<{id: number}> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.CREATE_USER }, createPayload);
      const data = await firstValueFrom<IRmqResp<{id: number} | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        if (data.errors[0] === CONSTS.USER_EXISTS) {
          throw new ConflictException(`Пользователь с таким email ${createPayload.email} уже существует`)
        }
        throw new BadRequestException(data.errors[0]);
      }
      if(!data.payload) {
        throw new BadRequestException('Пользователь не создан');
      }
      return data.payload;
    }
    catch (error) {
      throw new NotFoundException('Пользователь не создан');
    }
  }

  async udate(updatePayload: UpdateUserPayload): Promise<IUserData> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.UPDATE_USER }, updatePayload);
      const data = await firstValueFrom<IRmqResp<IUserData | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new BadRequestException(data.errors[0]);
      }
      if(!data.payload) {
        throw new BadRequestException('Пользователь не создан');
      }
      return data.payload;
    }
    catch (error) {
      throw new NotFoundException('Пользователь не создан');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.DELETE_USER }, { id });
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new BadRequestException(data.errors[0]);
      }
      if(!data.payload) {
        throw new BadRequestException(`Пользователя c id ${id} не удалось удалить`);
      }
      return data.payload;
    }
    catch (error) {
      throw new NotFoundException(`Пользователя c id ${id} не удалось удалить`);
    }
  }

  async login(dto: LoginDto): Promise<AtRt> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.LOGIN }, dto);
      const data = await firstValueFrom<IRmqResp<AtRt | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        if (data.errors[0] === CONSTS.USER_DOES_NOT_EXISTS) {
          throw new UnauthorizedException(`Ошибка входа: пользователя с email ${dto.email} не существует`)
        }
        if (data.errors[0] === CONSTS.USERS_INCORRECT_PASS) {
          throw new ForbiddenException('Ошибка входа: не верные пароль или логи')
        }
        throw new ForbiddenException(data.errors[0]);
      }
      return data.payload as AtRt;
    } catch(err) {
      throw new ForbiddenException(`Ошибка входа: не удалось войти с email ${dto.email}`);
    }
  }

  async logout(rt: string): Promise<boolean>{
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.LOGOUT }, rt);
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        if (data.errors[0] === CONSTS.NO_MAIL_RT) {
          throw new ForbiddenException('Ошибка выхода: не существует токена связанного с email')
        }
        if (data.errors[0] === CONSTS.NO_RT) {
          throw new UnauthorizedException('Ошибка выхода: токен не передан');
        }
        if (data.errors[0] === CONSTS.RT_NOT_VERIFIED) {
          throw new BadRequestException('Ошибка выхода: токен не верно верифицирован');
        }
        throw new BadRequestException(data.errors[0]);
      }
      return data.payload;
    } catch (error) {
      throw new BadRequestException('Ошибка выхода: что-то пошло не так');
    }
  }

  async refresh(rt: string): Promise<AtRt>{
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.REFRESH }, rt);
      const data = await firstValueFrom<IRmqResp<AtRt | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        if (data.errors[0] === CONSTS.NO_RT) {
          throw new UnauthorizedException('Ошибка обновления: токен не передан');
        }
        if (data.errors[0] === CONSTS.RT_NOT_VERIFIED) {
          throw new BadRequestException('Ошибка обновления: токен не верно верифицирован');
        }
        if (data.errors[0] === CONSTS.RT_NO_MATCH) {
          throw new ForbiddenException('Ошибка обновления: переданный токен не совпадает с текущим');
        }
        throw new BadRequestException(`Ошибка обновления: ${data.errors[0]}`);
      }
      return data.payload as AtRt;
    } catch (error) {
      throw new BadRequestException('Ошибка обновления: что-то пошло не так');
    }
  }
}
