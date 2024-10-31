import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ack } from 'libs/utils/helpers/ack';
import { CreateUserDto, USER_MSGS } from '@app/contracts/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: USER_MSGS.GET_USER })
  getUser(@Ctx() context: RmqContext) {
    ack(context);
    return this.userService.getUser();
  }

  @MessagePattern({ cmd: USER_MSGS.CREATE_USER })
  createUser(@Ctx() context: RmqContext, @Payload() dto: CreateUserDto ) {
    ack(context);
    return this.userService.createUser(dto);
  }
}
