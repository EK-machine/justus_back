import { IBaseEntity } from "libs/types/base.types";
import { IRulesToRoleDto, ICreateRole, IGetRole, IGetRoles, IUpdateRole } from "libs/types/rbac.types";

export class GetRolesDto implements IGetRoles {
    withRules: boolean;
}

export class GetRoleDto implements IGetRole {
    withRules: boolean;
    id: number;
}

export class CreateRoleDto implements ICreateRole {
    name: string;
}

export class UpdateRoleDto implements IUpdateRole {
    id: number;
    name: string;
}

export class DeleteRoleDto implements IBaseEntity {
    id: number;
}

export class RulesToRoleDto implements IRulesToRoleDto {
    id: number;
    ruleIds: number[];
}


