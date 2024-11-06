import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RuleEntity } from '../entities/rule.entity';
import { RoleRulesEntity } from '../entities/role_rules.entity';
import { RoleRulesModule } from '../role_rules/role_rules.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), forwardRef(() => RoleRulesModule) ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
