import { USER_CLIENT, USER_MSGS } from '@app/contracts/user';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { IUserData } from 'libs/types/user.types';
import { firstValueFrom, Observable } from 'rxjs';
import { CreateUserDto } from '../dto/user/createUser.dto';
import { IRmqResp } from 'libs/types/base.types';
import { UpdateUserBody } from '../dto/user/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_CLIENT) private readonly userClient: ClientProxy) {}
  async get(): Promise<IUserData[]> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.GET_USERS }, {});
      const data = await firstValueFrom<IRmqResp<IUserData[] | null>>(rmqResp);
      if(data.errors?.length) {
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
      if(data.errors?.length) {
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
      if(data.errors?.length) {
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

  async udate(updatePayload: UpdateUserBody): Promise<{id: number}> {
    try {
      const rmqResp = await this.userClient.send({ cmd: USER_MSGS.UPDATE_USER }, updatePayload);
      const data = await firstValueFrom<IRmqResp<IUserData | null>>(rmqResp);
      if(data.errors?.length) {
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
      if(data.errors?.length) {
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
}
