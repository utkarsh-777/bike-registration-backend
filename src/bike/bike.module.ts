/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeEntity } from 'src/db/entities/bike.entity';
import { requireLoginMiddleware } from 'src/middlewares/requireLogin.middleware';
import { BikeController } from './bike.controller';
import { BikeService } from './bike.service';

@Module({
  imports: [TypeOrmModule.forFeature([BikeEntity])],
  controllers: [BikeController],
  providers: [BikeService],
})
export class BikeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requireLoginMiddleware).forRoutes('bike');
  }
}
