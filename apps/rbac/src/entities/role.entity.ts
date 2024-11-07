import { IRole } from 'libs/types/rbac.types';
import { BaseEntity } from 'libs/utils/entity/base.entity';
import { Entity, Column, Relation,  OneToMany } from 'typeorm';
import { RoleRulesEntity } from './role_rules.entity';
import { RolesUsersEntity } from './roles_users.entity';

@Entity({ name: 'roles'})
export class RoleEntity extends BaseEntity implements IRole {
    @Column({
        type: 'character varying',
        unique: true
    })
    name: string;

    @OneToMany(() => RoleRulesEntity, (roleRulesEntity) => roleRulesEntity.role)
    roleRules:   Relation<RoleRulesEntity[]>;

    @OneToMany(() => RolesUsersEntity, (rolesUsersEntity) => rolesUsersEntity.role)
    roleUsers:   Relation<RolesUsersEntity[]>;
}