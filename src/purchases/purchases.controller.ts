import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {PurchaseEntity} from '../entity/purchase.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Controller('purchases')
export class PurchasesController {
    @InjectRepository(PurchaseEntity)
    protected readonly entitiesRepository: Repository<PurchaseEntity>;

    @Get()
    async getAll(): Promise<PurchaseEntity[]> {
        return this.entitiesRepository.find();
    }

    @Post()
    async create(@Body() dto: Partial<PurchaseEntity>): Promise<PurchaseEntity> {
        return this.entitiesRepository.save(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.entitiesRepository.delete(id);
    }
}
