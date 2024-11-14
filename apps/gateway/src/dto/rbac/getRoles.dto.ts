import { IsBoolean, IsOptional } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validation.msgs";
import { IGetRoles } from "libs/types/rbac.types";

export class GetRolesDto implements IGetRoles {
    @IsOptional()
    @IsBoolean({ message: VALIDATION_MSGS.WITH_RULES_IS_BOOL })
    withRules: boolean;

    @IsOptional()
    @IsBoolean({ message: VALIDATION_MSGS.WITH_USERS_IS_BOOL })
    withUsers: boolean;
}