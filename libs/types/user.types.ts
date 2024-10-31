export interface IUser {
    id: number,
    name: string;
    email: string;
    password: string;
}

export interface IUserPayload extends Omit<IUser, 'password'> {}

export interface IUserCreate {
    name: string;
    email: string;
    password: string;
}