import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GoodsModule} from "./goods/goods.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        GoodsModule
    ]
})
export class AppModule {
}
