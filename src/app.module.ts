import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { Pet } from './pet.entity';
import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: Number(process.env.PORT),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrations: ['dist/src/db/migrations/*.js'],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
    }),
    TypeOrmModule.forFeature([User, Pet]),
  ],
  controllers: [AppController, PetController],
  providers: [AppService, PetService],
})
export class AppModule {}
