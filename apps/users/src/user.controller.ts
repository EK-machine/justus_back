import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ack } from 'libs/utils/helpers/ack';
import { CreateUserDto, DeleteUserDto, UpdateUserDto, USER_MSGS } from '@app/contracts/user';
import { IUserData } from 'libs/types/user.types';
import { IRmqResp } from 'libs/types/base.types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: USER_MSGS.GET_USERS })
  async get(@Ctx() context: RmqContext): Promise<IRmqResp<IUserData[] | null>> {
    ack(context);
    return await this.userService.get();
  }

  @MessagePattern({ cmd: USER_MSGS.GET_USER })
  async getById(@Ctx() context: RmqContext, @Payload() payload: {id: number}): Promise<IRmqResp<IUserData | null>> {
    ack(context);
    return await this.userService.getById(payload.id);
  }

  @MessagePattern({ cmd: USER_MSGS.CREATE_USER })
  create(@Ctx() context: RmqContext, @Payload() dto: CreateUserDto ): Promise<IRmqResp<{id: number} | null>> {
    ack(context);
    return this.userService.create(dto);
  }

  @MessagePattern({ cmd: USER_MSGS.UPDATE_USER })
  udate(@Ctx() context: RmqContext, @Payload() dto: UpdateUserDto ): Promise<IRmqResp<IUserData | null>> {
    ack(context);
    return this.userService.udate(dto);
  }

  @MessagePattern({ cmd: USER_MSGS.DELETE_USER })
  delete(@Ctx() context: RmqContext, @Payload() dto: DeleteUserDto ): Promise<IRmqResp<boolean>> {
    ack(context);
    return this.userService.delete(dto);
  }
}
