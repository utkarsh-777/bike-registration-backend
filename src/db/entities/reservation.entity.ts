/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableName } from '../TableName';
import { UserEntity } from './user.entity';
import { BikeEntity } from './bike.entity';
import { ReviewReservationEntity } from './review_reservation.entity';

@Entity({ name: TableName.Reservation })
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', nullable: true })
  userId: number;

  @Column({ name: 'bikeId', nullable: true })
  bikeId: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'reservationStartDate' })
  reservationStartDate: string;

  @Column({ name: 'reservationEndDate' })
  reservationEndDate: string;

  @ManyToOne(() => UserEntity, (user) => user.reservations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => BikeEntity, (bike) => bike.reservations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  bike: BikeEntity;

  @OneToOne(
    () => ReviewReservationEntity,
    (reviewReservation) => reviewReservation.reservation,
  )
  review: ReviewReservationEntity;
}
