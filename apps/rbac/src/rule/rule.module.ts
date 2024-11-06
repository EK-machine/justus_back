import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { RuleEntity } from '../entities/rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RuleEntity]), RuleModule],
  controllers: [RuleController],
  providers: [RuleService],
  exports: [RuleService],
})
export class RuleModule {}
