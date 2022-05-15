import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Headers, Inject,
    Injectable,
    Param,
    Post,
    Put
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import {Board} from "../entity/board";
import {BoardItem} from "../entity/board-item";
import {Task} from "../entity/board-task";
import {JwtService} from "@nestjs/jwt";

@Controller('')
export class BoardsController {
    @InjectRepository(Board)
    protected readonly boardsRepository: Repository<Board>;
    @InjectRepository(BoardItem)
    protected readonly itemsRepository: Repository<BoardItem>;
    @InjectRepository(Task)
    protected readonly tasksRepository: Repository<Task>;

    constructor(
        private readonly jwtService: JwtService) {
    }

    /// Boards
    @Get('users/:uid/boards')
    async getBoards(@Param('uid')uid: string
    ): Promise<Board[]> {
        return this.boardsRepository.find({
            where: {
                uid: ILike(`${uid}`)
            }
        })
    }

    @Get ('board/last')
    async getLastBoardId(): Promise<Board> {
        return this.boardsRepository.findOne({
            order:{id: "DESC"},
        })
    }

    @Get ('board/:boardId/:userId')
    async getBoardById(@Param ('boardId')boardId :number,
                       @Param ('userId')userId: string,
                       @Headers() headers: any): Promise<Board> {
        const decoded: any = this.jwtService.decode(headers.auth);

        let board = await this.boardsRepository.findOne(boardId);
        if (board.uid !== decoded.user_id) {
            throw new BadRequestException({statusCode:403, message:'Forbidden', error:'Bad Request'});
            return;

        }

        return this.boardsRepository.findOne({
            where: {
                id: boardId,
                uid: userId
            }
        })
    }


    @Post('new')
    async addBoard(@Body() data: any,
                   @Headers() headers: any) {
        const decoded: any = this.jwtService.decode(headers.auth);
        console.log(data);

        let newBoard = new Board();
        newBoard.name = data.name;
        newBoard.uid = decoded.user_id;

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
        let board = await this.boardsRepository.findOne(idBoard,
            {relations: ['items']})
        if (!board) {
            throw new BadRequestException('Board is not found');
        }

        let items = await this.itemsRepository.find({
            select: ["id", "title", "order"],
            order: {
                "order":"ASC"
            },
            relations: ['board'],
            where: {
                board: {
                    id: `${idBoard}`
                }
            }
        });
        return items;
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

        let items = await this.itemsRepository.find({
            order: {
                "order":"DESC"
            },
            relations: ['board'],
            where: {
               board: {
                   id: `${idBoard}`
               }
            }
        });

        if (items.length === 0) {
            newItem.order = 1000;
        } else {
            newItem.order = items[0].order + 1000;
        }

        await this.itemsRepository.save(newItem);
    }


    @Put('items/:id')
    async updateItem(@Param('id')id: number,
                     @Body() data: any) {

        let item = await this.itemsRepository.findOne(id);
        if (!item) {
            throw new BadRequestException('Item is not found');
        }

        item.title = data.title;
        await this.itemsRepository.save(item);
    }

    @Put('items/:idItem/updateOrder')
    async updateOrderItemInside(@Param('idItem')idItem: number,
                                @Body() data: any) {

        let item = await this.itemsRepository.findOne(idItem);
        // task.item = await this.itemsRepository.findOne(data.idItem);

        if (data.idPrevItem === -1 && data.idNextItem !== -1) {
            console.log('Первый сверху в не пустом списке')
            let nextItem = await this.itemsRepository.findOne(data.idNextItem);
            console.log('старый order ',item,'новый order ', nextItem)
            console.log('старый order ',item.order,'новый order ', nextItem.order)
            item.order = nextItem.order - 50;
        }

        if (data.idPrevItem !== -1 && data.idNextItem === -1) {
            console.log('Последний в не пустом списке')
            let idPrevItem = await this.itemsRepository.findOne(data.idPrevItem);
            item.order = idPrevItem.order + 1;
        }

        if (data.idPrevItem !== -1 && data.idNextItem !== -1) {
            console.log('Середина списка')
            let nextItem = await this.itemsRepository.findOne(data.idNextItem);
            let prevItem = await this.itemsRepository.findOne(data.idPrevItem);
            console.log(Math.floor(prevItem.order + (nextItem.order - prevItem.order)/2))
            item.order = Math.floor(prevItem.order + (nextItem.order - prevItem.order)/2)
        }

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

        let tasks = await this.tasksRepository.find({
            select: ["id", "text", "order","desc"],
            order: {
                "order":"ASC"
            },
            relations: ['item'],
            where: {
                item: {
                    id: `${idItem}`
                }
            }
        });

        return tasks;
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
        newTask.desc = data.desc;

        let tasks = await this.tasksRepository.find({
            order: {
                "order":"DESC"
            },
            relations: ['item'],
            where: {
                item: {
                    id: `${idItem}`
                }
            }
        });

        if (tasks.length === 0) {
            newTask.order = 1000;
        } else {
            newTask.order = tasks[0].order + 1000;
        }

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
        task.desc = data.desc;
        await this.tasksRepository.save(task);
    }

    @Put('tasks/:idTask/updateOrderInsideTask')
    async updateOrderTasksInside(@Param('idTask')idTask: number,
                                 @Body() data: any) {

        let task = await this.tasksRepository.findOne(idTask);

        if (data.idPrevTask === -1 && data.idNextTask !== -1) {
            console.log('Первый сверху в не пустом списке')
            let nextTask = await this.tasksRepository.findOne(data.idNextTask);
            console.log('старый order ',task,'новый order ', nextTask)
            console.log('старый order ',task.order,'новый order ', nextTask.order)
            task.order = nextTask.order - 50;
        }

        if (data.idPrevTask !== -1 && data.idNextTask === -1) {
            console.log('Последний в не пустом списке')
            let idPrevTask = await this.tasksRepository.findOne(data.idPrevTask);
            task.order = idPrevTask.order + 1;
        }

        if (data.idPrevTask !== -1 && data.idNextTask !== -1) {
            console.log('Середина списка')
            let nextTask = await this.tasksRepository.findOne(data.idNextTask);
            let prevTask = await this.tasksRepository.findOne(data.idPrevTask);
            console.log(Math.floor(prevTask.order + (nextTask.order - prevTask.order)/2))
            task.order = Math.floor(prevTask.order + (nextTask.order - prevTask.order)/2)
        }

        await this.tasksRepository.save(task);
    }

    @Put('tasks/:idTask/updateOrderBetweenItems')
    async updateOrderTasksBetween(@Param('idTask')idTask: number,
                                  @Body() data: any,
                                  ) {

        let oldTask = await this.tasksRepository.findOne(idTask);
        oldTask.item = await this.itemsRepository.findOne(data.idItem);


        if (data.idPrevTask === -1 && data.idNextTask === -1) {
            console.log('Первый сверху в пустом списке')
            oldTask.order = 1000;
        }

        if (data.idPrevTask === -1 && data.idNextTask !== -1) {
            console.log('Первый сверху в не пустом списке')
            let idNextTask = await this.tasksRepository.findOne(data.idNextTask);
            oldTask.order = idNextTask.order -50;
        }

        if (data.idPrevTask !== -1 && data.idNextTask === -1) {
            console.log('Последний в не пустом списке')
            let idPrevTask = await this.tasksRepository.findOne(data.idPrevTask);
            oldTask.order = idPrevTask.order + 1000;
        }

        if (data.idPrevTask !== -1 && data.idNextTask !== -1) {
            console.log('Середина списка')
            let nextTask = await this.tasksRepository.findOne(data.idNextTask);
            let prevTask = await this.tasksRepository.findOne(data.idPrevTask);
            console.log(Math.floor(prevTask.order + (nextTask.order - prevTask.order)/2))
            oldTask.order = Math.floor(prevTask.order + (nextTask.order - prevTask.order)/2)
        }

        await this.tasksRepository.save(oldTask);
    }

    @Delete('tasks/:id')
    async deleteTask(@Param('id')id: number) {
        await this.tasksRepository.delete(id)
    }
}
