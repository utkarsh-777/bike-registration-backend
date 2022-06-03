/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeEntity } from 'src/db/entities/bike.entity';
import { UserEntity } from 'src/db/entities/user.entity';
import { isAdminMiddleware } from 'src/middlewares/isAdmin.middleware';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([BikeEntity]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(isAdminMiddleware).forRoutes('manager');
  }
}
