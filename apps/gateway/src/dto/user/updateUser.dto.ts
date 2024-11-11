import { IsString, IsEmail, IsOptional } from "class-validator";
import { CreateUserDto } from "./createUser.dto";
import { VALIDATION_MSGS } from "libs/consts/validation.msgs";

export class UpdateUserDto implements Partial<Omit<CreateUserDto, 'password'>> {
    @IsOptional()
    @IsString({ message: VALIDATION_MSGS.NAME_IS_STRING })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: VALIDATION_MSGS.EMAIL_IS_NOT_CORRECT })
    email?: string;
}

export class UpdateUserPayload extends UpdateUserDto {
    id: number;
}