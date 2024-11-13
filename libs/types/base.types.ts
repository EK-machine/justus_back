export interface IBaseEntity {
    id: number,
}

export type IRmqResp<T> = {
    payload: T;
    errors?: string[];
};
  