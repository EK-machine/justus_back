import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRulesModule } from '../role_rules/role_rules.module';
import { RolesUsersModule } from '../roles_users/roles_users.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), forwardRef(() => RoleRulesModule), forwardRef(() => RolesUsersModule) ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
