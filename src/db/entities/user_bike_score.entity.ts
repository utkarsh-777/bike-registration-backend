/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableName } from '../TableName';
import { BikeEntity } from './bike.entity';
import { UserEntity } from './user.entity';

@Entity({ name: TableName.UserBikeScore })
export class UserBikeScoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', nullable: true })
  userId: number;

  @Column({ name: 'bikeId', nullable: true })
  bikeId: number;

  @Column({ name: 'score' })
  score: number;

  @ManyToOne(() => UserEntity, (user) => user.scores, { onDelete: 'SET NULL' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => BikeEntity, (bike) => bike.userBikeScores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bike: BikeEntity;
}
