import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtGuard } from '../jwt/jwt.guard';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { AtRtModule } from '../atRt/at_rt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AtRtModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard, JwtStrategy],
})
export class UsersModule {}
