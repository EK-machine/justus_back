import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRulesEntity } from '../entities/role_rules.entity';
import { RoleRulesController } from './role_rules.controller';
import { RoleRulesService } from './role_rules.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRulesEntity]), forwardRef(() => RoleModule)],
  controllers: [RoleRulesController],
  providers: [RoleRulesService],
  exports: [RoleRulesService],
})
export class RoleRulesModule {}
