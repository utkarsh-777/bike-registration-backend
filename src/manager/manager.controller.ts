/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ManagerService } from './manager.service';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('add-bike')
  async addBike(
    @Body('model') model: string,
    @Body('color') color: string,
    @Body('location') location: string,
  ) {
    const response = await this.managerService.addBike(model, color, location);
    return response;
  }

  @Patch('update-bike/:bikeId')
  async updateBike(
    @Param('bikeId') id: number,
    @Body('model') model: string,
    @Body('color') color: string,
    @Body('location') location: string,
    @Body('isAvailable') isAvailable: boolean,
    @Body('avgRating') avgRating: number,
  ) {
    const response = await this.managerService.updateBike(
      id,
      model,
      color,
      location,
      isAvailable,
      avgRating,
    );
    return response;
  }

  @Delete('delete-bike/:bikeId')
  async deleteBike(@Param('bikeId') id: number) {
    const response = await this.managerService.deleteBike(id);
    return response;
  }

  @Patch('update-user/:userId')
  async updateUser(
    @Param('userId') id: number,
    @Body('fullName') fullName: string,
    @Body('password') password: string,
    @Body('role') role: string,
  ) {
    const response = await this.managerService.updateUser(
      id,
      fullName,
      password,
      role,
    );
    return response;
  }

  @Delete('delete-user/:userId')
  async deleteUser(@Param('userId') id: number) {
    const response = await this.managerService.deleteUser(id);
    return response;
  }

  @Get('get-user-with-reservations')
  async getUserWithReservation() {
    const response = this.managerService.getUserWithReservation();
    return response;
  }

  @Get('get-user-id/:userId')
  async getUserById(@Param('userId') userId: number) {
    const response = await this.managerService.getUserById(userId);
    return response;
  }
}
