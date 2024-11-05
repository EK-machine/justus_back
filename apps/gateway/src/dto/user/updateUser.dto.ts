import { IsString, IsEmail, IsOptional } from "class-validator";
import { VALIDATION_MSGS } from "libs/consts/validationmsgs";
import { CreateUserDto } from "./createUser.dto";

export class UpdateUserDto implements Partial<Omit<CreateUserDto, 'password'>> {
    @IsOptional()
    @IsString({ message: VALIDATION_MSGS.NAME_IS_STRING })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: VALIDATION_MSGS.EMAIL_IS_NOT_CORRECT })
    email?: string;
}

export interface UpdateUserBody extends UpdateUserDto {
    id: number;
}