import {BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {getRepository, ILike, Repository} from 'typeorm';
import {Board} from "../entity/board";
import {BoardItem} from "../entity/board-item";
import {Task} from "../entity/board-task";

@Controller('')
export class BoardsController {
    @InjectRepository(Board)
    protected readonly boardsRepository: Repository<Board>;
    @InjectRepository(BoardItem)
    protected readonly itemsRepository: Repository<BoardItem>;
    @InjectRepository(Task)
    protected readonly tasksRepository: Repository<Task>;

    /// Boards
    @Get('users/:uid/boards')
    async getBoards(@Param('uid')uid: string): Promise<Board[]> {
        return this.boardsRepository.find({
            where: {
                uid: ILike(`${uid}`)
            }
        })
    }

    @Post('new')
    async addBoard(@Body() data: any) {

        let newBoard = new Board();
        newBoard.name = data.name;
        newBoard.uid = data.uid;

        await this.boardsRepository.save(newBoard);
    }

    @Put(':id_board')
    async updateBoard(@Param('id_board')idBoard: number,
                          @Body()data: any) {
        let board = await this.boardsRepository.findOne(idBoard);
        if (!board) {
            throw new BadRequestException('Board is not found');
        }

        board.name = data.name;
        await this.boardsRepository.save(board);
    }

    @Delete(':id')
    async deleteBoard(@Param('id')id: number) {
        await this.boardsRepository.delete(id)
    }

    /// Items
    @Get('boards/:id/items')
    async getItems(@Param('id')idBoard: string): Promise<BoardItem[]> {
        let board = await this.boardsRepository.findOne(idBoard, {relations: ['items']})
        if (!board) {
            throw new BadRequestException('Board is not found');
        }
        return board.items;
    }

    @Post('boards/:id/items')
    async addItem(@Param('id')idBoard: string,
                  @Body() data: any) {
        let board = await this.boardsRepository.findOne(idBoard);
        if (!board) {
            throw new BadRequestException('Board is not found');
        }

        let newItem = new BoardItem();
        newItem.board = board;
        newItem.title = data.title;

        await this.itemsRepository.save(newItem);
    }


    @Put('items/:id')
    async updateItem(@Param('id')id: number,
                     @Body() data: any) {

        let item = await this.itemsRepository.findOne(id);
        if (!item) {
            throw new BadRequestException('Task is not found');
        }

        item.title = data.title;
        await this.itemsRepository.save(item);
    }

    @Delete('items/:id')
    async deleteItem(@Param('id')id: number) {
        await this.itemsRepository.delete(id);
    }


    /// Tasks
    @Get('items/:id/tasks')
    async getTasks(@Param('id')idItem: string): Promise<Task[]> {
        let boardItem = await this.itemsRepository.findOne(idItem, {relations: ['tasks']});
        if (!boardItem) {
            throw new BadRequestException('Board item is not found');
        }

        return boardItem.tasks;
    }

    @Post('items/:id/tasks')
    async addTask(@Param('id')idItem: string,
                  @Body() data: any) {
        let item = await this.itemsRepository.findOne(idItem);
        if (!item) {
            throw new BadRequestException('Item is not found');
        }

        let newTask = new Task();
        newTask.item = item;
        newTask.text = data.text;

        await this.tasksRepository.save(newTask);
    }

    @Put('tasks/:id')
    async updateTask(@Param('id')id: number,
                     @Body() data: any) {

        let task = await this.tasksRepository.findOne(id);
        if (!task) {
            throw new BadRequestException('Task is not found');
        }

        task.text = data.text;
        await this.tasksRepository.save(task);
    }

    @Delete('tasks/:id')
    async deleteTask(@Param('id')id: number) {
        await this.tasksRepository.delete(id)
    }
}
