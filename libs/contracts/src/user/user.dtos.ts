import { IBaseEntity } from "libs/types/base.types";
import { IUserCreate, IUserUpdate } from "libs/types/user.types";

export class CreateUserDto implements IUserCreate {
    name: string;
    user_name: string;
    password: string;
    email: string;
}

export class UpdateUserDto implements IUserUpdate {
    id: number;
    name?: string;
    user_name?: string;
    email?: string;
}

export class DeleteUserDto implements IBaseEntity {
    id: number;
}