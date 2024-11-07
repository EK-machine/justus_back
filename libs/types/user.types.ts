import { IBaseEntity } from "./base.types";

export interface IUser extends IBaseEntity {
    name: string;
    email: string;
    password: string;
}

export interface IUserData extends Omit<IUser, 'password'> {}
export interface IUserCreate extends Omit<IUserData, 'id'> {}
export interface IUserUpdate extends IBaseEntity {
    name?: string;
    email?: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface ILogin extends IUserLogin {}

export interface IJwtPayload { email: string }

export interface IAtRt { at: string; rt: string }

export interface IVerifyAt { at: string }

export interface IRt extends IBaseEntity {
    email: string;
    rt: string;
}