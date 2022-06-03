/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { BikeEntity } from 'src/db/entities/bike.entity';
import { CronJob } from 'cron';
import { ReservationEntity } from 'src/db/entities/reservation.entity';
import { UserBikeScoreEntity } from 'src/db/entities/user_bike_score.entity';
import { ReviewReservationEntity } from 'src/db/entities/review_reservation.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>,
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(UserBikeScoreEntity)
    private userBikeRepository: Repository<UserBikeScoreEntity>,
    @InjectRepository(ReviewReservationEntity)
    private reviewReservationRepository: Repository<ReviewReservationEntity>,
  ) {}

  async reserveBike(
    userId: number | null,
    bikeId: number | null,
    reservationStartDate: string | null,
    reservationEndDate: string | null,
    auth_user: any,
  ) {
    try {
      if (
        !userId ||
        !bikeId ||
        !reservationStartDate ||
        !reservationEndDate ||
        !auth_user
      ) {
        return { message: 'Provide all details!' };
      }

      const rsDate = new Date(reservationStartDate);
      const reDate = new Date(reservationEndDate);

      if (rsDate.getTime() < Date.now() + 60000) {
        return {
          message: 'Cannot reserve bike prior 1 minute!',
        };
      }

      if (rsDate.getTime() >= reDate.getTime()) {
        return {
          message:
            'Start Date and Time is greater than or equal to End Date and Time!',
        };
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['reservations'],
      });
      if (!user) {
        return { message: 'User not valid!' };
      }

      if (user.email !== auth_user.email) {
        return { message: 'You are not authorized!' };
      }

      for (let i = 0; i < user.reservations.length; i++) {
        if (
          user.reservations[i].bikeId == bikeId &&
          (user.reservations[i].status === 'active' ||
            user.reservations[i].status === 'upcoming')
        ) {
          return {
            message: 'Cannot reserve the same bike twice!',
          };
        }
      }

      const bike = await this.bikeRepository.findOne({
        where: { id: bikeId },
        relations: ['reservations'],
      });
      if (!bike) {
        return { message: 'Bike not valid!' };
      }

      for (let i = 0; i < bike.reservations.length; i++) {
        if (
          bike.reservations[i].status == 'upcoming' ||
          bike.reservations[i].status == 'active'
        ) {
          const bike_rsDate = new Date(
            bike.reservations[i].reservationStartDate,
          );
          const bike_reDate = new Date(bike.reservations[i].reservationEndDate);

          if (
            rsDate.getTime() >= bike_rsDate.getTime() &&
            rsDate.getTime() < bike_reDate.getTime()
          ) {
            return { message: 'Bike is not available at the selected time!' };
          }

          if (
            reDate.getTime() >= bike_rsDate.getTime() &&
            reDate.getTime() < bike_reDate.getTime()
          ) {
            return { message: 'Bike is not available at the selected time!' };
          }
        }
      }

      const reservation = this.reservationRepository.create({
        status: 'upcoming',
        reservationStartDate: rsDate.toString(),
        reservationEndDate: reDate.toString(),
        user,
        bike,
      });

      await this.reservationRepository.save(reservation);

      //SCHEDULE HERE ----------------------
      const job1 = new CronJob(rsDate, async () => {
        try {
          const current_reservation = await this.reservationRepository.findOne({
            where: { id: reservation.id },
            relations: ['user', 'bike'],
          });
          if (!current_reservation) {
            console.log('Error 137 line user.service');
            return;
          }

          if (current_reservation.user.email !== auth_user.email) {
            console.log({ message: 'You are not authorized!' });
            return;
          }

          if (current_reservation.status === 'cancel') {
            console.log({ message: 'Reservation already cancelled!' });
            return;
          }

          await this.reservationRepository.update(
            { id: reservation.id },
            { ...current_reservation, status: 'active' },
          );
          await this.bikeRepository.update(
            { id: bikeId },
            { ...current_reservation.bike, isAvailable: false },
          );
          console.log('Reservation is active!');
        } catch (error) {
          console.log(error);
          return;
        }
      });
      job1.start();

      const job2 = new CronJob(reDate, async () => {
        try {
          const current_reservation = await this.reservationRepository.findOne({
            where: { id: reservation.id },
            relations: ['user', 'bike'],
          });
          if (!current_reservation) {
            console.log({ message: 'Reservation not valid!' });
            return;
          }

          if (current_reservation.user.email !== auth_user.email) {
            console.log({ message: 'You are not authorized!' });
            return;
          }

          if (current_reservation.status === 'cancel') {
            console.log({ message: 'Reservation already cancelled!' });
            return;
          }

          const cancel_reservation = {
            ...current_reservation,
            status: 'cancel',
          };
          const update_bike = {
            ...current_reservation.bike,
            isAvailable: true,
          };

          await this.reservationRepository.update(
            { id: reservation.id },
            cancel_reservation,
          );
          await this.bikeRepository.update(
            { id: reservation.bikeId },
            update_bike,
          );
          console.log({ message: 'Reservation cancelled!' });
          return;
        } catch (error) {
          console.log(error);
          console.log({ message: 'Error cancelling reservation!' });
          return;
        }
      });
      job2.start();

      return { message: 'Reservation successfully created!' };
    } catch (error) {
      console.log(error);
      return { message: 'Error in reservation!' };
    }
  }

  async cancelReservation(reservationId: number | null, auth_user: any) {
    try {
      if (!reservationId) {
        return { message: 'Provide all fields!' };
      }

      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['user', 'bike'],
      });
      if (!reservation) {
        return { message: 'Reservation not valid!' };
      }

      if (reservation.user.email !== auth_user.email) {
        return { message: 'You are not authorized!' };
      }

      if (reservation.status === 'cancel') {
        return { message: 'Reservation is already cancelled!' };
      }

      const cancel_reservation = { ...reservation, status: 'cancel' };
      const update_bike = { ...reservation.bike, isAvailable: true };

      await this.reservationRepository.update(
        { id: reservationId },
        cancel_reservation,
      );
      await this.bikeRepository.update({ id: reservation.bikeId }, update_bike);
      return { message: 'Reservation cancelled!' };
    } catch (error) {
      console.log(error);
      return { message: 'Error cancelling reservation!' };
    }
  }

  async rateBike(
    userId: number | null,
    bikeId: number | null,
    score: number | null,
  ) {
    try {
      if (!userId || !bikeId || !score) {
        return { message: 'Provide all information!' };
      }
      score = +score;
      const bike = await this.bikeRepository.findOne({
        where: { id: bikeId },
        relations: ['userBikeScores'],
      });
      if (!bike) {
        return { message: 'Bike not valid!' };
      }
      let updateUserBikeScores = null;
      for (let i = 0; i < bike.userBikeScores.length; i++) {
        if (
          bike.userBikeScores[i].userId == userId &&
          bike.userBikeScores[i].bikeId == bikeId
        ) {
          updateUserBikeScores = bike.userBikeScores[i];
          break;
        }
      }

      if (updateUserBikeScores) {
        await this.userBikeRepository.update(
          { id: updateUserBikeScores.id },
          { ...updateUserBikeScores, score },
        );
        const new_avg_rating =
          (bike.avgRating * bike.userBikeScores.length -
            updateUserBikeScores.score +
            score) /
          bike.userBikeScores.length;
        const updatedBike = {
          id: bike.id,
          model: bike.model,
          color: bike.color,
          location: bike.location,
          isAvailable: bike.isAvailable,
          avgRating: new_avg_rating,
        };
        await this.bikeRepository.update({ id: bikeId }, { ...updatedBike });
        return { message: 'Successfully updated score!' };
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const new_score = this.userBikeRepository.create({
        score,
        user,
        bike,
      });

      const new_avg_rating =
        (bike.avgRating * bike.userBikeScores.length + score) /
        (bike.userBikeScores.length + 1);

      const updatedBike = {
        id: bike.id,
        model: bike.model,
        color: bike.color,
        location: bike.location,
        isAvailable: bike.isAvailable,
        avgRating: new_avg_rating,
      };
      await this.bikeRepository.update({ id: bikeId }, { ...updatedBike });
      await this.userBikeRepository.save(new_score);
      return { message: 'Score made for this bike!' };
    } catch (error) {
      console.log(error);
      return { message: 'Unable to set score!' };
    }
  }

  async getUserBikeScoreByUserId(userId: number | null, bikeId: number | null) {
    try {
      const userBikeScore = await this.userBikeRepository.findOne({
        where: { userId, bikeId },
      });
      if (!userBikeScore) {
        return { message: 'No score given till now!' };
      }
      return userBikeScore;
    } catch (error) {
      console.log(error);
      return { message: 'Unable to get score!' };
    }
  }

  async rateReservation(
    reservationId: number | null,
    comment: string | null,
    rating: number | null,
    auth_user: any,
  ) {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['review', 'user'],
      });
      if (!reservation) {
        return { message: 'Reservation not valid!' };
      }

      if (reservation.user.email !== auth_user.email) {
        return { message: 'You are not authorized!' };
      }

      if (reservation.status !== 'active') {
        return { message: 'You can only review active reservations!' };
      }

      const review_exist = await this.reviewReservationRepository.findOne({
        where: { reservationId },
      });

      if (review_exist) {
        await this.reviewReservationRepository.update(
          { id: review_exist.id },
          { ...review_exist, comment, rating },
        );
        return { message: 'Updated review!' };
      }

      const new_review = this.reviewReservationRepository.create({
        comment,
        rating,
        reservation,
      });
      await this.reviewReservationRepository.save(new_review);
      return { message: 'Created review!' };
    } catch (error) {
      console.log(error);
      return { message: 'Unable to review reservation!' };
    }
  }

  async getUserReservations(auth_user: any) {
    try {
      const userData = await this.userRepository.findOne({
        where: { email: auth_user.email },
        relations: ['reservations'],
      });
      if (!userData) {
        return { message: 'User not valid!' };
      }
      return userData.reservations;
    } catch (error) {
      console.log(error);
      return { message: 'Unable to get reservations!' };
    }
  }

  async getUserReservationById(
    reservationId: number | null,
    userEmail: string | null,
    auth_user: any,
  ) {
    try {
      if (userEmail !== auth_user.email) {
        return { message: 'You are not authorized!' };
      }
      const reservationData = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['review'],
      });
      if (!reservationData) {
        return { message: 'Reservation not valid!' };
      }
      return reservationData;
    } catch (error) {
      console.log(error);
      return { message: 'Unable to get reservation!' };
    }
  }

  async getBikesByDate(
    reservationStartDate: string | null,
    reservationEndDate: string | null,
  ) {
    try {
      if (!reservationStartDate || !reservationEndDate) {
        return { message: 'Provide all details!' };
      }
      const all_bikes = await this.bikeRepository.find({
        relations: ['reservations'],
      });
      const queried_rsDate = new Date(reservationStartDate).getTime();
      const queried_reDate = new Date(reservationEndDate).getTime();
      const resultedBikes = [];
      all_bikes.forEach((bike) => {
        let flag = true;
        for (let i = 0; i < bike.reservations.length; i++) {
          if (
            bike.reservations[i].status === 'active' ||
            bike.reservations[i].status === 'upcoming'
          ) {
            flag = false;
            const bike_rsDate = new Date(
              bike.reservations[i].reservationStartDate,
            ).getTime();
            const bike_reDate = new Date(
              bike.reservations[i].reservationEndDate,
            ).getTime();
            if (queried_reDate < bike_rsDate || queried_rsDate > bike_reDate) {
              resultedBikes.push(bike);
              break;
            }
          }
        }
        if (flag) {
          resultedBikes.push(bike);
        }
      });
      return resultedBikes;
    } catch (error) {
      console.log(error);
      return { message: 'Unable to get bikes!' };
    }
  }

  async filterBikes(
    attribute: string | null,
    value: string | null,
    rating: number | null,
  ) {
    try {
      if (!attribute) {
        return { message: 'Provide the attribute!' };
      }
      if (attribute === 'model') {
        const bikes = await this.bikeRepository.find({
          where: { model: Like(`%${value}%`) },
        });
        return bikes;
      }

      if (attribute === 'color') {
        const bikes = await this.bikeRepository.find({
          where: { color: Like(`%${value}%`) },
        });
        return bikes;
      }

      if (attribute === 'location') {
        const bikes = await this.bikeRepository.find({
          where: { location: Like(`%${value}%`) },
        });
        return bikes;
      }

      if (attribute === 'avgRating') {
        if (rating === null) {
          return { message: 'Provide the rating!' };
        }
        const bikes = await this.bikeRepository.find({
          where: { avgRating: rating },
        });
        return bikes;
      }

      return { message: 'Attribute not valid!' };
    } catch (error) {
      console.log(error);
      return { message: 'Error in filtering bikes!' };
    }
  }

  async getUser(userId: number | null) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['reservations'],
      });
      return user;
    } catch (error) {
      console.log(error);
      return { message: 'Unable to get user!' };
    }
  }

  async getBikeById(bikeId: number | null) {
    try {
      const bike = await this.bikeRepository.findOne({
        where: { id: bikeId },
        relations: ['reservations'],
      });
      if (!bike) {
        return { message: 'Bike not valid!' };
      }
      return bike;
    } catch (error) {
      console.log(error);
      return { message: 'Error getting bike!' };
    }
  }
}
