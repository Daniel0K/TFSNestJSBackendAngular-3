import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {BoardItem} from "./board-item";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => BoardItem, (item) => item.tasks)
    item: BoardItem;

    @Column()
    text: string;

    @Column()
    order: number;

}
