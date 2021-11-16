import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PurchaseEntity} from '../entity/purchase.entity';
import {PurchasesController} from './purchases.controller';

@Module({
    imports: [TypeOrmModule.forFeature([
        PurchaseEntity
    ])],
    controllers: [PurchasesController]
})
export class PurchasesModule {
}
