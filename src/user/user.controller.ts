/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('reserve-bike/:userId/:bikeId')
  async reserveBike(
    @Param('userId') userId: number,
    @Param('bikeId') bikeId: number,
    @Body('reservationStartDate') reservationStartDate: string,
    @Body('reservationEndDate') reservationEndDate: string,
    @Body('auth_user') auth_user: any,
  ) {
    const response = await this.userService.reserveBike(
      userId,
      bikeId,
      reservationStartDate,
      reservationEndDate,
      auth_user,
    );
    return response;
  }

  @Patch('cancel-reservation/:reservationId')
  async cancelReservation(
    @Param('reservationId') reservationId: number,
    @Body('auth_user') auth_user: any,
  ) {
    const response = await this.userService.cancelReservation(
      reservationId,
      auth_user,
    );
    return response;
  }

  @Patch('rate-bike/:userId/:bikeId')
  async rateBike(
    @Param('userId') userId: number,
    @Param('bikeId') bikeId: number,
    @Body('score') score: number,
  ) {
    const response = await this.userService.rateBike(userId, bikeId, score);
    return response;
  }

  @Patch('rate-reservation/:reservationId')
  async rateReview(
    @Param('reservationId') reservationId: number,
    @Body('comment') comment: string,
    @Body('rating') rating: number,
    @Body('auth_user') auth_user: any,
  ) {
    const response = await this.userService.rateReservation(
      reservationId,
      comment,
      rating,
      auth_user,
    );
    return response;
  }

  @Get('get-user-reservations')
  async getUserReservations(@Body('auth_user') auth_user: any) {
    const response = await this.userService.getUserReservations(auth_user);
    return response;
  }

  @Post('get-user-reservation-id/:reservationId')
  async getUserReservationById(
    @Param('reservationId') reservationId: number,
    @Body('userEmail') userEmail: string,
    @Body('auth_user') auth_user: any,
  ) {
    const response = await this.userService.getUserReservationById(
      reservationId,
      userEmail,
      auth_user,
    );
    return response;
  }

  @Post('get-bikes-by-date')
  async getBikesByDate(
    @Body('reservationStartDate') reservationStartDate: string,
    @Body('reservationEndDate') reservationEndDate: string,
  ) {
    const response = await this.userService.getBikesByDate(
      reservationStartDate,
      reservationEndDate,
    );
    return response;
  }

  @Patch('filter-bikes')
  async filterBikes(
    @Body('attribute') attribute: string,
    @Body('value') value: string,
    @Body('rating') rating: number,
  ) {
    const response = await this.userService.filterBikes(
      attribute,
      value,
      rating,
    );
    return response;
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: number) {
    const response = await this.userService.getUser(userId);
    return response;
  }

  @Get('get-bike/:bikeId')
  async getBikeById(@Param('bikeId') bikeId: number) {
    const response = await this.userService.getBikeById(bikeId);
    return response;
  }

  @Get('get-user-bike-score/:userId/:bikeId')
  async getUserBikeScoreByUserId(
    @Param('userId') userId: number,
    @Param('bikeId') bikeId: number,
  ) {
    const response = await this.userService.getUserBikeScoreByUserId(
      userId,
      bikeId,
    );
    return response;
  }
}
