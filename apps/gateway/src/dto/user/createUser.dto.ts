import { IUserCreate } from "libs/types/user.types";

export class CreateUserDto implements IUserCreate {
    name: string;
    password: string;
    email: string;
}