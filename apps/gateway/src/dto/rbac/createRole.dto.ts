import { IsNotEmpty, IsString } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validationmsgs";
import { ICreateRole } from "libs/types/rbac.types";


export class CreateRoleDto implements ICreateRole {
    @IsNotEmpty({ message: VALIDATION_MSGS.ROLE_IS_EMPTY })
    @IsString({ message: VALIDATION_MSGS.ROLE_IS_STRING })
    name: string;
}