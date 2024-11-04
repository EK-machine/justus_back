import { IBaseEntity } from "./base.types";

export interface IUser extends IBaseEntity {
    name: string;
    user_name: string;
    email: string;
    password: string;
}

export interface IUserData extends Omit<IUser, 'password'> {}
export interface IUserCreate extends Omit<IUserData, 'id'> {}
export interface IUserUpdate extends IBaseEntity {
    name?: string;
    user_name?: string;
    email?: string;
}