import { USER_CLIENT, USER_MSGS } from '@app/contracts/user';
import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy} from '@nestjs/microservices';
import { IUserData, IAtRt } from 'libs/types/user.types';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../dto/user/createUser.dto';
import { IRmqResp } from 'libs/types/base.types';
import { UpdateUserPayload } from '../dto/user/updateUser.dto';
import { ERRORR_MSGS, userDoesNotExists, userExists } from 'libs/consts/validationmsgs';
import { LoginDto } from '../dto/user/login.dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_CLIENT) private readonly userClient: ClientProxy) {}
  async get(): Promise<IUserData[]> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.GET_USERS }, {});
      const data = await firstValueFrom<IRmqResp<IUserData[] | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(ERRORR_MSGS.USERS_NOT_FOUD);
      }
      return data.payload;
    } catch (error) {
      throw new NotFoundException(`Ошибка получения пользователей: ${error.message}`);
    }
  }

  async getById(id: number): Promise<IUserData> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.GET_USER }, { id });
      const data = await firstValueFrom<IRmqResp<IUserData | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(`пользователь с id ${id} не найден`);
      }
      return data.payload;
    } catch (error) {
      throw new NotFoundException(`Ошибка получения пользователя: ${error.message}`);
    }
  }

  async create(createPayload: CreateUserDto): Promise<{id: number}> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.CREATE_USER }, createPayload);
      const data = await firstValueFrom<IRmqResp<{id: number} | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error('пользователь не создан');
      }
      return data.payload;
    }
    catch (error) {
      if(error.message === userExists(createPayload.email)) {
        throw new ConflictException(`Ошибка создания пользователя: ${error.message}`)
      }
      throw new BadRequestException(`Ошибка создания пользователя: ${error.message}`);
    }
  }

  async udate(updatePayload: UpdateUserPayload): Promise<IUserData> {
    try {
      if(updatePayload.id === 1) {
        throw new Error(ERRORR_MSGS.MAIN_USER_UPDATE);
      }
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.UPDATE_USER }, updatePayload);
      const data = await firstValueFrom<IRmqResp<IUserData | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(`пользователь с id ${updatePayload.id} не обновлён`);
      }
      return data.payload;
    } catch (error) {
      if(error.message === ERRORR_MSGS.MAIN_USER_UPDATE) {
        throw new ForbiddenException(`Ошибка обновления пользователя: ${error.message}`);
      }
      throw new BadRequestException(`Ошибка обновления пользователя: ${error.message}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // todo delete roles_user
      if(id === 1) {
        throw new Error(ERRORR_MSGS.MAIN_USER_DEL);
      }
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.DELETE_USER }, { id });
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(`пользователя c id ${id} не удалось удалить`);
      }
      return data.payload;
    } catch (error) {
      if(error.message === ERRORR_MSGS.MAIN_USER_DEL) {
        throw new ForbiddenException(`Ошибка удаления пользователя: ${error.message}`);
      }
      throw new BadRequestException(`Ошибка удаления пользователя: ${error.message}`);
    }
  }

  async login(dto: LoginDto): Promise<IAtRt> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.LOGIN }, dto);
      const data = await firstValueFrom<IRmqResp<IAtRt | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      return data.payload as IAtRt;
    } catch(error) {
      if (error.message === userDoesNotExists(dto.email)) {
        throw new UnauthorizedException(`Ошибка входа: ${error.message}`)
      }
      throw new ForbiddenException(`Ошибка входа: ${error.message}`);
    }
  }

  async logout(rt: string): Promise<boolean>{
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.LOGOUT }, rt);
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      return data.payload;
    } catch (error) {
      if (error.message === ERRORR_MSGS.NO_USER_MAIL_RT) {
        throw new ForbiddenException(`Ошибка выхода: ${error.message}`)
      }
      if (error.message === ERRORR_MSGS.NO_RT) {
        throw new UnauthorizedException(`Ошибка выхода: ${error.message}`);
      }
      throw new BadRequestException(`Ошибка выхода: ${error.message}`);
    }
  }

  async refresh(rt: string): Promise<IAtRt>{
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.REFRESH }, rt);
      const data = await firstValueFrom<IRmqResp<IAtRt | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      return data.payload as IAtRt;
    } catch (error) {
      if (error.message === ERRORR_MSGS.NO_RT) {
        throw new UnauthorizedException(`Ошибка обновления: ${error.message}`);
      }
      if (error.message === ERRORR_MSGS.RT_NO_MATCH) {
        throw new ForbiddenException(`Ошибка обновления: ${error.message}`);
      }
      throw new BadRequestException(`Ошибка обновления: ${error.message}`);
    }
  }
}
