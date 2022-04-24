import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GoodsController} from "./goods.controller";
import {GoodsEntity} from "../entity/goods.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        GoodsEntity
    ])],
    controllers: [GoodsController]
})
export class GoodsModule {
}
