import { IBaseEntity } from "./base.types";

export interface IRoleId {
    role_id: number;
}

export interface IRoleToRole {
    user_id: number;
}

export interface IRolesUsers extends IRoleId, IRoleToRole {}

export interface IRolesUsersEntity extends IRolesUsers, IBaseEntity {}

export interface IRoleRules extends IRoleId, IBaseEntity {
    rule_id: number;
}

export interface IRole extends IBaseEntity {
    name: string;
    rules?: IRule[];
}

export interface IRoleRelational extends IBaseEntity {
    name: string;
    roleRules: IRoleRules[];
}

export interface IRule extends IBaseEntity {
    method: string;
    def: string;
}

export interface IGetRoles {
    withRules: boolean;
}

export interface IGetRole extends IGetRoles {
    id: number;
}

export interface ICreateRole {
    name: string;
}

export interface IUpdateRole extends ICreateRole {}

export interface IRule extends IBaseEntity {
    method: string;
    def: string;
}

export interface IRulesToRole {
    ruleIds: number[];
}

export interface IRulesToRoleDto extends IRulesToRole {
    id: number;
}