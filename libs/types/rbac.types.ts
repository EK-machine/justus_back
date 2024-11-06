import { IBaseEntity } from "./base.types";

export interface IRoleRules extends IBaseEntity {
    role_id: number;
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
export interface IRoleRules extends IBaseEntity {
    role_id: number;
    rule_id: number;
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