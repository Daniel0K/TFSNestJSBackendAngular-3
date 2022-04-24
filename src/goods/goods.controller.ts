import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {GoodsEntity} from "../entity/goods.entity";

@Controller('goods')
export class GoodsController {
    @InjectRepository(GoodsEntity)
    protected readonly entitiesRepository: Repository<GoodsEntity>;

    @Get()
    async getAll(): Promise<GoodsEntity[]> {
        return this.entitiesRepository.find();
    }
}
