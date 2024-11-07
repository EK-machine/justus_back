import { IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validationmsgs";
import { IRoleToRole } from "libs/types/rbac.types";


export class RoleToUserDto implements IRoleToRole {
    @IsNotEmpty({ message: VALIDATION_MSGS.USER_ID_IS_EMPTY })
    @IsInt({ each: true, message: VALIDATION_MSGS.USER_ID_IS_NUM })
    @IsPositive({ each: true, message: VALIDATION_MSGS.USER_ID_IS_POS_NUM })
    user_id: number;
}


export class RoleToUserPayload extends RoleToUserDto {
    role_id: number;
}