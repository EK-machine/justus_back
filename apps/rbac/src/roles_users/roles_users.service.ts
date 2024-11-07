import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { IRmqResp } from 'libs/types/base.types';
import { RolesUsersEntity } from '../entities/roles_users.entity';
import { RolesToUserDto } from '@app/contracts/rbac';

@Injectable()
export class RolesUsersService {
  constructor(
    @InjectRepository(RolesUsersEntity) private readonly rolesUsersRepo: Repository<RolesUsersEntity>,
    private readonly roleService: RoleService,
  ) {}

  async addRoleToUser(payload: RolesToUserDto): Promise<IRmqResp<boolean>> {
    try {
      const { role_id, user_id } = payload;
      const [roleRmqResp, roleUser] = await Promise.all([
        this.roleService.getById({id: role_id, withRules: false}),
        this.rolesUsersRepo.findOne({where: { user_id }}) // todo проверка на наличие пользователя
      ]);
      if(roleUser) {
        return {payload: false, errors: ['указанный пользователь уже имеет эту роль']};
      }
      if(roleRmqResp.errors && roleRmqResp.errors.length > 0) {
        return {payload: false, errors: roleRmqResp.errors};
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
}
