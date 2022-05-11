import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BoardsModule} from "./Boards/boards.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({autoLoadEntities: true}),
        BoardsModule,
    ]
})
export class AppModule {
}
