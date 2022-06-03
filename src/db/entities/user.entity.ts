/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TableName } from '../TableName';
import { ReservationEntity } from './reservation.entity';
import { UserBikeScoreEntity } from './user_bike_score.entity';

@Entity({ name: TableName.User })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'role' })
  role: string;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user)
  reservations: ReservationEntity[];

  @OneToMany(() => UserBikeScoreEntity, (userBikeScore) => userBikeScore.user)
  scores: UserBikeScoreEntity[];
}
