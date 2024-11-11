import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAtRt, IJwtPayload } from 'libs/types/user.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RtEntity } from '../entities/rt.entity';
import * as bcrypt from 'bcrypt';
import { IRmqResp } from 'libs/types/base.types';
import { ERRORR_MSGS } from 'libs/consts/error.msgs';

@Injectable()
export class AtRtService {
  constructor(
    @InjectRepository(RtEntity) private readonly rtRepo: Repository<RtEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyAt(at: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.getAtData(at);
      return { exp };
    } catch(error){
      throw new UnauthorizedException('Авторизируйтесь для продолжения');
    }
  }

  async verifyRt(rt: string): Promise<IRmqResp<{ email: string, iat: number; exp: number } | null>> {
    try {
      if(!rt) {
        return { payload: null, errors: [ERRORR_MSGS.NO_RT] };
      }
      const data = await this.jwtService.verifyAsync<{ email: string, iat: number; exp: number }>(rt, {
        secret: this.configService.get<string>('R_SECRET'),
      });
      return { payload: data };
    } catch (error) {
      return { payload: null, errors: [ERRORR_MSGS.RT_NOT_VERIFIED] };
    }
  }

  async getTokens(jwtPayload: IJwtPayload): Promise<IRmqResp<IAtRt | null>>{
    try {
      const [at, rt] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.get<string>('A_SECRET'),
          expiresIn: Number(this.configService.get<string>('SECRET_CONF_INFO')),
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.get('R_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        }),
      ]);
      const oldRt = await this.rtRepo.findOne({
        where: { email: jwtPayload.email },
      });
      
      const hashedRt = await bcrypt.hash(rt, 12);
      if (!oldRt) {
        this.rtRepo.save({
          email: jwtPayload.email,
          rt: hashedRt,
        });
      }
      if (oldRt) {
        this.rtRepo.save({ ...oldRt, rt: hashedRt });
      }

      return { payload: { at, rt } };
    } catch (error) {
      return { payload: null, errors: ['не удалось получить токены'] };
    }
  }

  async delete(email: string): Promise<IRmqResp<boolean>> {
    try {
      const oldRt = await this.rtRepo.findOne({
        where: { email },
      });
      if (!oldRt) {
        return { payload: false, errors: [ERRORR_MSGS.NO_USER_MAIL_RT] };
      }
      const delRes = await this.rtRepo.delete({ email });
      if (!delRes.affected) {
        return { payload: false, errors: [`не удалсоь удалтить токен связанный с ${email}`] };
      }
      return { payload: true }
    } catch (error) {
      return { payload: false, errors: [`не удалось выйти c email ${email}`] };
    }
  }

  async refresh(rt: string): Promise<IRmqResp<IAtRt | null>> {
    try {
      const verifyData = await this.verifyRt(rt);
      if(verifyData.errors && verifyData.errors.length > 0) {
        return { payload: null, errors: verifyData.errors };
      }
      if(!verifyData.payload || verifyData.payload.email.length === 0) {
        return { payload: null, errors: [ERRORR_MSGS.RT_NOT_VERIFIED] };
      }
      const oldUserRt = await this.rtRepo.findOne({
        where: { email: verifyData.payload.email },
      });
      if (!oldUserRt || !oldUserRt.rt) {
        return { payload: null, errors: [ERRORR_MSGS.NO_RT] };
      }
      const rtMatches = await bcrypt.compare(rt, oldUserRt.rt);
      if (!rtMatches) {
        return { payload: null, errors: [ERRORR_MSGS.RT_NO_MATCH] };
      }
      return await this.getTokens({email: oldUserRt.email});
    } catch (error) {
      return { payload: null, errors: ['не удалось обновить токены'] };
    }
  }

  async getAtData(at: string): Promise<{ email: string, exp: number }> {
    if(!at) {
      throw new UnauthorizedException('Авторизируйтесь для продолжения');
    }
    try {
      const { email, exp } = await this.jwtService.verifyAsync<{ email: string, exp: number }>(at);
      return { email, exp };
    } catch(error){
      throw new UnauthorizedException('Авторизируйтесь для продолжения');
    }
  }
}
