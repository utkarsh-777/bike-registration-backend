/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { BikeService } from './bike.service';

@Controller('bike')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @Get('all-bikes')
  async getBikes() {
    const response = await this.bikeService.getAllBikes();
    return response;
  }

  @Post('add-bike')
  async addBike(
    @Body('model') model: string,
    @Body('color') color: string,
    @Body('location') location: string,
  ) {
    const response = await this.bikeService.addBike(model, color, location);
    return response;
  }
}
