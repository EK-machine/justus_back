import { Module } from '@nestjs/common';
import { AtRtService } from './at_rt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RtEntity } from '../entities/rt.entity';
import { JwtGuard } from '../jwt/jwt.guard';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { AtRtController } from './at_rt.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('A_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('SECRET_CONF_INFO')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RtEntity]),
  ],
  controllers: [AtRtController],
  providers: [AtRtService, JwtGuard, JwtStrategy],
  exports: [AtRtService],
})
export class AtRtModule {}
