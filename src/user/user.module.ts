/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeEntity } from 'src/db/entities/bike.entity';
import { UserEntity } from 'src/db/entities/user.entity';
import { requireLoginMiddleware } from 'src/middlewares/requireLogin.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationEntity } from 'src/db/entities/reservation.entity';
import { UserBikeScoreEntity } from 'src/db/entities/user_bike_score.entity';
import { ReviewReservationEntity } from 'src/db/entities/review_reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([BikeEntity]),
    TypeOrmModule.forFeature([ReservationEntity]),
    TypeOrmModule.forFeature([UserBikeScoreEntity]),
    TypeOrmModule.forFeature([ReviewReservationEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requireLoginMiddleware).forRoutes('user');
  }
}
