import { IUser } from 'libs/types/user.types';
import { BaseEntity } from 'libs/utils/entity/base.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'users'})
export class UserEntity extends BaseEntity implements IUser {
    @Column({
        type: 'character varying'
    })
    name: string;

    @Column({
        unique: true,
        type: 'character varying'
    })
    user_name: string;

    @Column({
        type: 'character varying'
    })
    password: string;

    @Column({
        type: 'character varying',
        unique: true
    })
    email: string;
}