import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BoardsModule} from "./Boards/boards.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forRoot({autoLoadEntities: true}),
        BoardsModule,
    ]
})
export class AppModule {
}
