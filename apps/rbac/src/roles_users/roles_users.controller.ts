import { Controller } from '@nestjs/common';
import { RolesUsersService } from './roles_users.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RulesToRoleDto, RBAC_MSGS, RolesToUserDto } from '@app/contracts/rbac';
import { IRmqResp } from 'libs/types/base.types';
import { ack } from 'libs/utils/helpers/ack';

@Controller()
export class RolesUsersController {
  constructor(private readonly rolesUsersService: RolesUsersService) {}

  @MessagePattern({ cmd: RBAC_MSGS.ADD_ROLE_TO_USER })
  addRoleToUser(@Ctx() context: RmqContext, @Payload() payload: RolesToUserDto): Promise<IRmqResp<boolean>> {
    ack(context);
    return this.rolesUsersService.addRoleToUser(payload);
  }

  @MessagePattern({ cmd: RBAC_MSGS.DELETE_ROLE_FROM_USER })
  delRoleToUser(@Ctx() context: RmqContext, @Payload() payload: RolesToUserDto): Promise<IRmqResp<boolean>> {
    ack(context);
    return this.rolesUsersService.delRoleToUser(payload);
  }

  // @MessagePattern({ cmd: RBAC_MSGS.CHECK_USERS_ROLES })
  // delRoleToUser(@Ctx() context: RmqContext, @Payload() payload: RolesToUserDto): Promise<IRmqResp<boolean>> {
  //   ack(context);
  //   return this.rolesUsersService.delRoleToUser(payload);
  // }
}