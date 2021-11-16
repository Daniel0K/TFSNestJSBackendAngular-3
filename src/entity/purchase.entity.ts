import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PurchaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    price: number;
}
