import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Task} from "./board-task";
import {Board} from "./board";

@Entity()
export class BoardItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        nullable: true
    })
    order: number;

    @ManyToOne(() => Board, (board) => board.items)
    board: Board;

    @OneToMany(() => Task, (task) => task.item)
    tasks: Task[];
}
