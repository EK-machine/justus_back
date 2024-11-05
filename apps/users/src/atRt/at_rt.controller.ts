import { Controller } from '@nestjs/common';
import { AtRtService } from './at_rt.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ack } from 'libs/utils/helpers/ack';
import { USER_MSGS } from '@app/contracts/user';
import { AtRt, JwtVerify } from 'libs/types/user.types';
import { IRmqResp } from 'libs/types/base.types';

@Controller()
export class AtRtController {
  constructor(private readonly atRtService: AtRtService) {}

  @MessagePattern({ cmd: USER_MSGS.VERIFY })
  verifyAt(@Ctx() context: RmqContext, @Payload() payload: JwtVerify ): Promise<{ exp: number }> {
    ack(context);
    return this.atRtService.verifyAt(payload.jwt);
  }

  @MessagePattern({ cmd: USER_MSGS.REFRESH})
  refresh(@Ctx() context: RmqContext, @Payload() rt: string ): Promise<IRmqResp<AtRt | null>> {
    ack(context);
    return this.atRtService.refresh(rt);
  }
}
