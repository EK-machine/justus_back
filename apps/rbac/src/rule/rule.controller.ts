import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { ack } from 'libs/utils/helpers/ack';
import { RBAC_MSGS } from '@app/contracts/rbac/rbac.messages';
import { IRmqResp } from 'libs/types/base.types';
import { IRule } from 'libs/types/rbac.types';
import { RuleService } from './rule.service';

@Controller()
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @MessagePattern({ cmd: RBAC_MSGS.GET_RULES })
  get(@Ctx() context: RmqContext): Promise<IRmqResp<IRule[] | null>>  {
    ack(context);
    return this.ruleService.get();
  }
}
