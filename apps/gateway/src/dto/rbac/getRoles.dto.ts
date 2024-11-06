import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsOptional } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validationmsgs";
import { IGetRoles } from "libs/types/rbac.types";

export class GetRolesDto implements IGetRoles {
    @IsOptional()
    @IsBoolean({ message: VALIDATION_MSGS.WITH_RULES_IS_BOOL })
    withRules: boolean;
}