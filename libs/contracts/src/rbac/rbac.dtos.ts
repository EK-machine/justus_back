import { IBaseEntity } from "libs/types/base.types";
import { IRulesToRoleDto, ICreateRole, IGetRole, IGetRoles, IUpdateRole, IRolesUsers } from "libs/types/rbac.types";

export class GetRolesDto implements IGetRoles {
    withRules: boolean;
    withUsers: boolean;
}

export class GetRoleDto implements IGetRole {
    withUsers: boolean;
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

export class RolesToUserDto implements IRolesUsers {
    user_id: number;
    role_id: number;
}


