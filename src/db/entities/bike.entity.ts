import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TableName } from '../TableName';
import { ReservationEntity } from './reservation.entity';
import { UserBikeScoreEntity } from './user_bike_score.entity';

@Entity({ name: TableName.Bike })
export class BikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'model' })
  model: string;

  @Column({ name: 'color' })
  color: string;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'isAvailable' })
  isAvailable: boolean;

  @Column({ name: 'avgRating' })
  avgRating: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.bike)
  reservations: ReservationEntity[];

  @OneToMany(() => UserBikeScoreEntity, (userBikeScore) => userBikeScore.bike)
  userBikeScores: UserBikeScoreEntity[];
}
