import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, QueryRunner, Repository } from 'typeorm';
import { RoleRulesEntity } from '../entities/role_rules.entity';
import { RulesToRoleDto } from '@app/contracts/rbac';
import { RoleService } from '../role/role.service';
import { filterIds } from 'libs/utils/helpers/filterIds';
import { IRmqResp } from 'libs/types/base.types';

@Injectable()
export class RoleRulesService {
  constructor(
    @InjectRepository(RoleRulesEntity) private readonly roleRulesRepo: Repository<RoleRulesEntity>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async deleteMany(ids: number[], queryRunner: QueryRunner): Promise<IRmqResp<boolean>> {
    try {
      const delRes = await queryRunner.manager.delete(RoleRulesEntity, { id: In(ids) });
      if(!delRes.affected) {
        return { payload: false, errors: ['не удалось удалить связи ролей с правилами'] };
      }
      return { payload: true };
    } catch (error) {
      return { payload: false, errors: [error.message] };
    }
  }

  async addRulesToRole(payload: RulesToRoleDto): Promise<IRmqResp<boolean>> {
    try {
      const { id, ruleIds } = payload;
      const roleRmqResp = await this.roleService.getById({ id, withRules: true });
      if(roleRmqResp.errors && roleRmqResp.errors.length > 0) {
        return {payload: false, errors: roleRmqResp.errors};
      }
      if(!roleRmqResp.payload) {
        return {payload: false, errors: [`не существует роли с id ${id}`]};
      }
      const assignedRoleIds = roleRmqResp.payload.rules ? roleRmqResp.payload.rules.map(rule => rule.id) : [];
      const ruleIdsToAdd = filterIds(assignedRoleIds, ruleIds);
      if(ruleIdsToAdd.length === 0) {
        return {payload: false, errors: ['указанные права уже привязаны к роли']};
      }
      const dataToAdd = ruleIdsToAdd.map(ruleId => ({role_id: id, rule_id: ruleId}));
      // todo add check
      const res = await Promise.all(dataToAdd.map(el => this.roleRulesRepo.save({...el})));

      return {payload: true};

    } catch (error) {
      return {payload: false, errors: ['не удалось добавить права к роли']};
    }
  }

  async delRulesFromRole(payload: RulesToRoleDto): Promise<IRmqResp<boolean>> {
    try {
      const { id, ruleIds } = payload;
      const delRes = await this.roleRulesRepo.delete({role_id: id, rule_id: In(ruleIds)});
      if(!delRes.affected) {
        return {payload: false, errors: ['не удалось удалить права из роли']};
      }

      return {payload: true};

    } catch (error) {
      return {payload: false, errors: ['не удалось добавить права к роли']};
    }
  }
}
