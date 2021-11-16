import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PositionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    price: number;
}
