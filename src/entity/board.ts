import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {BoardItem} from "./board-item";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    uid: string;

    @OneToMany(() => BoardItem, (item) => item.board)
    items: BoardItem[];
}
