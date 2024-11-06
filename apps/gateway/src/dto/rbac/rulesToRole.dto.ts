import { IsArray, IsInt, IsPositive } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validationmsgs";
import { IRulesToRole } from "libs/types/rbac.types";


export class RulesToRoleDto implements IRulesToRole {
    @IsArray({ message: VALIDATION_MSGS.ROLE_RULES_IS_ARRAY })
    @IsInt({ each: true, message: VALIDATION_MSGS.ROLE_RULES_IS_NUM })
    @IsPositive({ each: true, message: VALIDATION_MSGS.ROLE_RULES_IS_POS_NUM })
    ruleIds: number[];
}


export class RulesToRolePayload extends RulesToRoleDto {
    id: number;
}