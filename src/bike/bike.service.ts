/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BikeEntity } from 'src/db/entities/bike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>,
  ) {}

  async getAllBikes() {
    const data = await this.bikeRepository.find();
    return data;
  }

  async addBike(
    model: string | null,
    color: string | null,
    location: string | null,
  ) {
    try {
      if (!model || !color || !location) {
        return { message: 'Provide all fields!' };
      }

      const newBike = this.bikeRepository.create({
        model,
        color,
        location,
        isAvailable: true,
        avgRating: 0,
      });
      await this.bikeRepository.save(newBike);
      return newBike;
    } catch (error) {
      console.log(error);
      return { message: 'Cannot save bike!' };
    }
  }
}
