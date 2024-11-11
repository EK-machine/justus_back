import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesUsersController } from './roles_users.controller';
import { RolesUsersService } from './roles_users.service';
import { RoleModule } from '../role/role.module';
import { RolesUsersEntity } from '../entities/roles_users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolesUsersEntity]), forwardRef(() => RoleModule)],
  controllers: [RolesUsersController],
  providers: [RolesUsersService],
  exports: [RolesUsersService],
})
export class RolesUsersModule {}
