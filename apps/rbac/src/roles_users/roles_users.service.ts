import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { IRmqResp } from 'libs/types/base.types';
import { RolesUsersEntity } from '../entities/roles_users.entity';
import { RolesToUserDto } from '@app/contracts/rbac';
import { ICheckUserRole } from 'libs/types/rbac.types';
import { areAllMethodsPresent } from 'libs/utils/helpers/areAllMethodsPresent';

@Injectable()
export class RolesUsersService {
  constructor( 
    @InjectRepository(RolesUsersEntity) private readonly rolesUsersRepo: Repository<RolesUsersEntity>,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    
  ) {}

  async getRolesUsers(roleId: number) {
    try {
      return await this.rolesUsersRepo.find({where: { role_id: roleId }});
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addRoleToUser(payload: RolesToUserDto): Promise<IRmqResp<boolean>> {
    try {
      const { role_id, user_id } = payload;
      const [roleRmqResp, roleUser] = await Promise.all([
        this.roleService.getById({id: role_id, withRules: false}),
        this.rolesUsersRepo.findOne({ where: { user_id }})
      ]);
      if(roleRmqResp.errors && roleRmqResp.errors.length > 0) {
        return {payload: false, errors: roleRmqResp.errors};
      }
      if(roleUser) {
        return {payload: false, errors: ['указанный пользователь уже имеет эту роль']};
      }
      const newRoleUser = await this.rolesUsersRepo.save({ user_id, role_id });

      if(!newRoleUser) {
        return {payload: false, errors: [`не удалось добавить роль ${roleRmqResp.payload?.name} к пользователю'`]};
      }

      return {payload: true};
    } catch (error) {
      return {payload: false, errors: ['не удалось добавить роль к пользователю']};
    }
  }

  async delRoleToUser(payload: RolesToUserDto): Promise<IRmqResp<boolean>> {
    try {
      const { role_id, user_id } = payload;
      const delRes = await this.rolesUsersRepo.delete({role_id, user_id});
      if(!delRes.affected) {
        return {payload: false, errors: ['не удалось снять роль с пользователя']};
      }

      return {payload: true};

    } catch (error) {
      return {payload: false, errors: ['не удалось снять роль с пользователя']};
    }
  }

  async delRoleToUserByRoleId(role_id: number): Promise<DeleteResult> {
    try {
      return await this.rolesUsersRepo.delete({role_id});
    } catch (error) {
       return {raw: null, affected: 0};
    }
  }

  async checkUserRoles(payload: ICheckUserRole): Promise<boolean> {
    try {
      const { methods, user_id } = payload;
      const userRoles = await this.rolesUsersRepo.findOne({ where: { user_id } });
      if(!userRoles) {
        return false;
      }

      const rolesWithRules = await this.roleService.getById({id: userRoles.role_id, withRules: true});
      if(rolesWithRules.errors && rolesWithRules.errors.length > 0) {
        throw new UnauthorizedException(rolesWithRules.errors[0]);
      }
      if(!rolesWithRules.payload) {
        throw new UnauthorizedException('Вызываемый метод запрещён');
      }

      const { rules } = rolesWithRules.payload;

      if(!rules) {
        return false;
      }

      const existingMethods = rules.map(rule => rule.method);

      const providedMethods: string[] = Object.values(methods);

      if (existingMethods.length === 0 || providedMethods.length === 0) {
        return false;
      }

      return areAllMethodsPresent(existingMethods, providedMethods);
    } catch (error) {
      throw new UnauthorizedException('Вызываемый метод запрещён');
    }
  }

  async deleteRolesUser(user_id: number): Promise<IRmqResp<boolean>> {
    try {
      const delRes = await this.rolesUsersRepo.delete({user_id});
      if(!delRes.affected) {
        return {payload: false, errors: ['не удалить связь роли с пользователем']};
      }

      return {payload: true};

    } catch (error) {
      return {payload: false, errors: ['не удалить связь роли с пользователем']};
    }
  }
}


