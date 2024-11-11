import { IsString, IsNotEmpty } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validation.msgs";
import { IUpdateRole } from "libs/types/rbac.types";

export class UpdateRoleDto implements IUpdateRole {
    @IsNotEmpty({ message: VALIDATION_MSGS.ROLE_IS_EMPTY })
    @IsString({ message: VALIDATION_MSGS.ROLE_IS_STRING })
    name: string;
}

export class UpdateRolePayload extends UpdateRoleDto {
    id: number;
}