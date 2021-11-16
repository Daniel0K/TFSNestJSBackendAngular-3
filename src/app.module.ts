import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PurchasesModule} from './purchases/purchases.module';
import {PositionsModule} from './positions/positions.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        PurchasesModule,
        PositionsModule
    ]
})
export class AppModule {
}
