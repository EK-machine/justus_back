import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ack } from 'libs/utils/helpers/ack';
import { RoleService } from './role.service';
import { RBAC_MSGS } from '@app/contracts/rbac/rbac.messages';
import { IRmqResp } from 'libs/types/base.types';
import { IRole } from 'libs/types/rbac.types';
import { CreateRoleDto, DeleteRoleDto, GetRoleDto, GetRolesDto, UpdateRoleDto } from '@app/contracts/rbac';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({ cmd: RBAC_MSGS.GET_ROLES })
  get(@Ctx() context: RmqContext, @Payload() payload: GetRolesDto): Promise<IRmqResp<IRole[] | null>> {
    ack(context);
    return this.roleService.get(payload);
  }

  @MessagePattern({ cmd: RBAC_MSGS.GET_ROLE })
  getById(@Ctx() context: RmqContext, @Payload() payload: GetRoleDto): Promise<IRmqResp<IRole | null>> {
    ack(context);
    return this.roleService.getById(payload);
  }

  @MessagePattern({ cmd: RBAC_MSGS.CREATE_ROLE })
  create(@Ctx() context: RmqContext, @Payload() payload: CreateRoleDto): Promise<IRmqResp<{id: number} | null>> {
    ack(context);
    return this.roleService.create(payload);
  }

  @MessagePattern({ cmd: RBAC_MSGS.UPDATE_ROLE })
  udate(@Ctx() context: RmqContext, @Payload() dto: UpdateRoleDto ): Promise<IRmqResp<IRole | null>> {
    ack(context);
    return this.roleService.udate(dto);
  }

  @MessagePattern({ cmd: RBAC_MSGS.DELETE_ROLE })
  delete(@Ctx() context: RmqContext, @Payload() dto: DeleteRoleDto ): Promise<IRmqResp<boolean>> {
    ack(context);
    return this.roleService.delete(dto);
  }
}
