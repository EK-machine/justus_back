import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validation.msgs";
import { IUserCreate } from "libs/types/user.types";

export class CreateUserDto implements IUserCreate {
    @IsNotEmpty({ message: VALIDATION_MSGS.NAME_IS_EMPTY })
    @IsString({ message: VALIDATION_MSGS.NAME_IS_STRING })
    name: string;

    @IsNotEmpty({ message: VALIDATION_MSGS.PASS_IS_EMPTY })
    @IsString({ message: VALIDATION_MSGS.PASS_IS_STRING })
    password: string;

    @IsNotEmpty({ message: VALIDATION_MSGS.EMAIL_IS_EMPTY })
    @IsEmail({}, { message: VALIDATION_MSGS.EMAIL_IS_NOT_CORRECT })
    email: string;
}