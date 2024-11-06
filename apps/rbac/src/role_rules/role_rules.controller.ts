import { Controller } from '@nestjs/common';
import { RoleRulesService } from './role_rules.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RulesToRoleDto, RBAC_MSGS } from '@app/contracts/rbac';
import { IRmqResp } from 'libs/types/base.types';
import { ack } from 'libs/utils/helpers/ack';

@Controller()
export class RoleRulesController {
  constructor(private readonly roleRulesService: RoleRulesService) {}

  @MessagePattern({ cmd: RBAC_MSGS.ADD_RULES_TO_ROLE })
  addRulesToRole(@Ctx() context: RmqContext, @Payload() payload: RulesToRoleDto): Promise<IRmqResp<boolean>> {
    ack(context);
    return this.roleRulesService.addRulesToRole(payload);
  }

  @MessagePattern({ cmd: RBAC_MSGS.DELETE_RULES_FROM_ROLE })
  delRulesFromRole(@Ctx() context: RmqContext, @Payload() payload: RulesToRoleDto): Promise<IRmqResp<boolean>> {
    ack(context);
    return this.roleRulesService.delRulesFromRole(payload);
  }
}