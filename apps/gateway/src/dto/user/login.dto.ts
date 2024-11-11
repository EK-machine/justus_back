import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validation.msgs";
import { ILogin } from "libs/types/user.types";

export class LoginDto implements ILogin {
    @IsNotEmpty({ message: VALIDATION_MSGS.EMAIL_IS_EMPTY })
    @IsEmail({}, { message: VALIDATION_MSGS.EMAIL_IS_NOT_CORRECT })
    email: string;

    @IsNotEmpty({ message: VALIDATION_MSGS.PASS_IS_EMPTY })
    @IsString({ message: VALIDATION_MSGS.PASS_IS_STRING })
    password: string;
}