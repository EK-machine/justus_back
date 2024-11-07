import { IRolesUsersEntity } from 'libs/types/rbac.types';
import { BaseEntity } from 'libs/utils/entity/base.entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'roles_users'})
export class RolesUsersEntity extends BaseEntity implements IRolesUsersEntity {
    @Column({
        type: 'integer',
    })
    role_id: number;

    @Column({
        type: 'integer',
        unique: true
    })
    user_id: number;

    @ManyToOne(() => RoleEntity, (role) => role.roleUsers)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;
}