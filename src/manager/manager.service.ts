/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BikeEntity } from 'src/db/entities/bike.entity';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>,
  ) {}

  async addBike(
    model: string | null,
    color: string | null,
    location: string | null,
  ) {
    try {
      if (!model || !color || !location) {
        return { message: 'Enter all fields!' };
      }
      const newBike = this.bikeRepository.create({
        model: model.toUpperCase().trim(),
        color,
        location,
        isAvailable: true,
        avgRating: 0,
      });
      await this.bikeRepository.save(newBike);
      return newBike;
    } catch (error) {
      console.log(error);
      return { message: 'Error saving bike!' };
    }
  }

  async updateBike(
    id: number | null,
    model: string | null,
    color: string | null,
    location: string | null,
    isAvailable: boolean | null,
    avgRating: number | null,
  ) {
    try {
      if (!id) {
        return { message: 'Provide Bike id!' };
      }
      const bike = await this.bikeRepository.findOneBy({ id });
      if (!bike) {
        return { message: 'Bike not found!' };
      }
      const updatedBike = { ...bike };
      if (model) {
        updatedBike.model = model;
      }

      if (color) {
        updatedBike.color = color;
      }

      if (location) {
        updatedBike.location = location;
      }

      if (isAvailable !== null) {
        updatedBike.isAvailable = isAvailable;
      }

      if (avgRating !== null) {
        updatedBike.avgRating = avgRating;
      }

      await this.bikeRepository.update(
        { id },
        {
          model: updatedBike.model,
          color: updatedBike.color,
          location: updatedBike.location,
          isAvailable: updatedBike.isAvailable,
          avgRating: updatedBike.avgRating,
        },
      );
      return updatedBike;
    } catch (error) {
      console.log(error);
      return { message: 'Error updating bike!' };
    }
  }

  async deleteBike(id: number | null) {
    try {
      if (!id) {
        return { message: 'Provide Bike Id!' };
      }

      const bike = await this.bikeRepository.findOneBy({ id });
      if (!bike) {
        return { message: 'Bike not found!' };
      }

      await this.bikeRepository.delete(bike);
      return { message: `${bike.model} deleted successfully!` };
    } catch (error) {
      console.log(error);
      return { message: 'Error deleting bike!' };
    }
  }

  async updateUser(
    id: number | null,
    fullName: string | null,
    password: string | null,
    role: string | null,
  ) {
    try {
      if (!id) {
        return { message: 'Provide User ID!' };
      }
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return { message: 'User not found!' };
      }

      const updatedUser = { ...user };
      if (fullName) {
        updatedUser.fullName = fullName;
      }

      if (password) {
        updatedUser.password = await hash(password, 12);
      }

      if (role) {
        updatedUser.role = role;
      }

      await this.userRepository.update(
        { id },
        {
          fullName: updatedUser.fullName,
          password: updatedUser.password,
          role: updatedUser.role,
        },
      );
      return updatedUser;
    } catch (error) {
      console.log(error);
      return { message: 'Error updating User!' };
    }
  }

  async deleteUser(id: number | null) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return { message: 'User not found!' };
      }
      await this.userRepository.delete(user);
      return user;
    } catch (error) {
      console.log(error);
      return { message: 'Error deleting User!' };
    }
  }

  async getUserWithReservation() {
    try {
      const users = await this.userRepository.find({
        relations: ['reservations'],
      });
      const response = [];
      users.forEach((user) => {
        if (user.reservations.length > 0) {
          response.push(user);
        }
      });
      return response;
    } catch (error) {
      console.log(error);
      return { message: 'Error getting user!' };
    }
  }

  async getUserById(userId: number | null) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['reservations'],
      });
      return user;
    } catch (error) {
      console.log(error);
      return { message: 'Error getting user!' };
    }
  }
}
