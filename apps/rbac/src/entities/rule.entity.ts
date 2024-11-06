import { IRule } from 'libs/types/rbac.types';
import { BaseEntity } from 'libs/utils/entity/base.entity';
import { Entity, Column, Relation, OneToMany } from 'typeorm';
import { RoleRulesEntity } from './role_rules.entity';

@Entity({ name: 'rules'})
export class RuleEntity extends BaseEntity implements IRule {
    @Column({
        type: 'character varying',
        unique: true
    })
    method: string;

    @Column({
        type: 'character varying',
        unique: true
    })
    def: string;

    @OneToMany(() => RoleRulesEntity, (roleRulesEntity) => roleRulesEntity.rule)
    roleRules: Relation<RoleRulesEntity>;
}