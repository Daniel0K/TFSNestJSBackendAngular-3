import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Board} from "../entity/board";
import {BoardsController} from "./boards.controller";
import {BoardItem} from "../entity/board-item";
import {Task} from "../entity/board-task";

@Module({
    imports: [TypeOrmModule.forFeature([
        Board,
        BoardItem,
        Task
    ])],
    controllers: [BoardsController]
})
export class BoardsModule {
}
