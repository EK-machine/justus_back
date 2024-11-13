import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { IRmqResp } from 'libs/types/base.types';
import { IGetRole, IRole, IRoleRelational } from 'libs/types/rbac.types';
import { RoleRulesEntity } from '../entities/role_rules.entity';
import { RuleEntity } from '../entities/rule.entity';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from '@app/contracts/rbac';
import { RoleRulesService } from '../role_rules/role_rules.service';
import { RolesUsersService } from '../roles_users/roles_users.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>,
    @Inject(forwardRef(() => RoleRulesService))
    private readonly roleRulesService: RoleRulesService,
    @Inject(forwardRef(() => RolesUsersService))
    private readonly rolesUsersService: RolesUsersService,
    private readonly dataSource: DataSource,
  ) {}

  async get(withRules: boolean = false): Promise<IRmqResp<IRole[] | null>> {
    try {
      let roles: IRole[] = [];
      if(withRules) {
        roles = await this.roleRepo.createQueryBuilder('role')
        .leftJoin(
          RoleRulesEntity,
          'roleRules',
          'roleRules.role_id = role.id')
        .leftJoinAndMapMany(
          'role.rules',
          RuleEntity,
          'rule',
          'roleRules.rule_id = rule.id')
        .getMany();
      } else {
        roles = await this.roleRepo.find();
      }     
      return { payload: roles };
    } catch(error){
      return { payload: null, errors: ['Роли не найдены'] };
    }
  }

  async getById({id, withRules = false}: IGetRole): Promise<IRmqResp<IRole | null>> {
    try {
      if(withRules) {
        const role = await this.roleRepo.createQueryBuilder('role')
        .leftJoin(
          RoleRulesEntity,
          'roleRules',
          'roleRules.role_id = role.id')
        .leftJoinAndMapMany(
          'role.rules',
          RuleEntity,
          'rule',
          'roleRules.rule_id = rule.id')
        .where('role.id = :id', { id })
        .getOne();
        if(!role) {
          return { payload: null, errors: [`роль с id ${id} и правилами не найдена`] };
        }
        return {payload: role};
      } else {
        const role = await this.roleRepo.findOne({where: { id }});
        if(!role) {
          return { payload: null, errors: [`роль с id ${id} не найдена`] };
        }
        return {payload: role};
      }     
    } catch(error){
      return { payload: null, errors: [`роль с id ${id} не найдена`] };
    }
  }

  async create(dto: CreateRoleDto): Promise<IRmqResp<{id: number} | null>> {
    try {
      const newRole = await this.roleRepo.save({...dto});
      return { payload: {id: newRole.id} };
    } catch (error) {
      if (error.message.includes('duplicate key value')) {
        return { payload: null, errors: [error.message] };
      }
      return { payload: null, errors: ['роль не создана'] };
    }
  }

  async udate(dto: UpdateRoleDto): Promise<IRmqResp<IRole | null>> {
    try {
      const roleRmqResp  = await this.getById({id: dto.id, withRules: false});
      if(!roleRmqResp.payload) {
        return { payload: null, errors: [`роли c id ${dto.id} для обновления не существует`] };
      }

      const roleToEdit = { ...roleRmqResp.payload, ...dto };
      const saved = await this.roleRepo.save(roleToEdit);
      
      return { payload: saved };
    } catch (error) {
      return { payload: null, errors: [`роль с id ${dto.id} не обновлена`] };
    }
  }

  async delete(dto: DeleteRoleDto): Promise<IRmqResp<boolean>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const role = await this.roleRepo.createQueryBuilder('role')
      .leftJoinAndMapMany(
        'role.roleRules',
        RoleRulesEntity,
        'roleRules',
        'roleRules.role_id = role.id')
      .where('role.id = :id', { id: dto.id })
      .getOne() as IRoleRelational;

      if(!role) {
        await queryRunner.rollbackTransaction();
        return { payload: false, errors: [`роли c id ${dto.id} для удаления не существует`] };
      }

      const rolesUsers = await this.rolesUsersService.getRolesUsers(dto.id);
      const delResArr: IRmqResp<boolean>[] = [];

      if(role.roleRules.length > 0) {
        const roleRuleIds = role.roleRules.map(roleRule => roleRule.id);

        const [roleRulesDelRes, roleUsersDelRes] = await Promise.all([
          this.roleRulesService.deleteMany(roleRuleIds, queryRunner),
          rolesUsers.length > 0 && this.rolesUsersService.delRoleToUserByRoleId(dto.id, queryRunner),
        ]);

        delResArr.push(roleRulesDelRes);
        if(roleUsersDelRes) {
          delResArr.push(roleUsersDelRes);
        }

        const roleDelRes = await queryRunner.manager.delete(RoleEntity, { id: dto.id });

        if(!roleDelRes.affected) {
          delResArr.push({ payload: false })
        } else {
          delResArr.push({ payload: true })
        }
        
        const delRes = delResArr.every(res => res.payload);
        if(!delRes) {
          await queryRunner.rollbackTransaction();
          return { payload: false, errors: [`роль c id ${dto.id} и отношения к правам ${roleRuleIds.join(', ')} не удалось удалить`] };
        }
        await queryRunner.commitTransaction();
        return { payload: delRes };
      }

      if(rolesUsers.length > 0) {
        const roleUsersDelRes = await this.rolesUsersService.delRoleToUserByRoleId(dto.id, queryRunner);
        if(roleUsersDelRes) {
          delResArr.push(roleUsersDelRes);
        }
      }

      const roleDelRes = await queryRunner.manager.delete(RoleEntity, { id: dto.id });
      if(!roleDelRes.affected) {
        delResArr.push({ payload: false })
      } else {
        delResArr.push({ payload: true })
      }

      const delRes = delResArr.every(res => res.payload);

      if(!delRes) {
        await queryRunner.rollbackTransaction();
        return { payload: false, errors: [`роль c id ${dto.id} не удалось удалить`] };
      }
      await queryRunner.commitTransaction();
      return { payload: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { payload: false, errors: [`роль c id ${dto.id} не удалось удалить`] };
    } finally {
      await queryRunner.release();
    }
  }
}
