import { IRt } from 'libs/types/user.types';
import { BaseEntity } from 'libs/utils/entity/base.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'users_rt'})
export class RtEntity extends BaseEntity implements IRt {
    @Column({
        type: 'character varying',
        unique: true
    })
    email: string;

    @Column({
        type: 'character varying'
    })
    rt: string;
}