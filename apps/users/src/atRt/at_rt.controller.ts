import { Controller } from '@nestjs/common';
import { AtRtService } from './at_rt.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ack } from 'libs/utils/helpers/ack';
import { USER_MSGS } from '@app/contracts/user';
import { IAtRt, IVerifyAt } from 'libs/types/user.types';
import { IRmqResp } from 'libs/types/base.types';

@Controller()
export class AtRtController {
  constructor(private readonly atRtService: AtRtService) {}

  @MessagePattern({ cmd: USER_MSGS.VERIFY })
  verifyAt(@Ctx() context: RmqContext, @Payload() payload: IVerifyAt ): Promise<{ exp: number }> {
    ack(context);
    return this.atRtService.verifyAt(payload.at);
  }

  @MessagePattern({ cmd: USER_MSGS.REFRESH})
  refresh(@Ctx() context: RmqContext, @Payload() rt: string ): Promise<IRmqResp<IAtRt | null>> {
    ack(context);
    return this.atRtService.refresh(rt);
  }
}
