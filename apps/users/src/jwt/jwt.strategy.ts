import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRequest } from './jwt.request';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'libs/types/user.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                    (request: JwtRequest) => {
                      return request?.jwt ? request.jwt : null;
                    },
                ]),
                ignoreExpiration: false,
                secretOrKey: configService.get('A_SECRET'),
        });
    }
    async validate(payload: IJwtPayload) {
        return { ...payload };
    }
}