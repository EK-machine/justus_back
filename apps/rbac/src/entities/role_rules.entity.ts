import { IRoleRules } from 'libs/types/rbac.types';
import { BaseEntity } from 'libs/utils/entity/base.entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from './role.entity';
import { RuleEntity } from './rule.entity';

@Entity({ name: 'role_rules'})
export class RoleRulesEntity extends BaseEntity implements IRoleRules {
    @Column({
        type: 'integer',
    })
    role_id: number;

    @Column({
        type: 'integer',
    })
    rule_id: number;

    @ManyToOne(() => RoleEntity, (role) => role.roleRules)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @ManyToOne(() => RuleEntity, (rule) => rule.roleRules)
    @JoinColumn({ name: 'rule_id' })
    rule: RuleEntity;
}