import { IBaseEntity } from "libs/types/base.types";
import { IUserCreate, IUserLogin, IUserUpdate } from "libs/types/user.types";

export class CreateUserDto implements IUserCreate {
    name: string;
    password: string;
    email: string;
}

export class UpdateUserDto implements IUserUpdate {
    id: number;
    name?: string;
    email?: string;
}

export class DeleteUserDto implements IBaseEntity {
    id: number;
}

export class UserLoginDto implements IUserLogin {
    email: string;
    password: string;
}

