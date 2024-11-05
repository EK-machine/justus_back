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

export interface JwtPayload { email: string }

export interface AtRt { at: string; rt: string }

export interface JwtVerify { jwt: string }

export interface IRt extends IBaseEntity {
    email: string;
    rt: string;
}