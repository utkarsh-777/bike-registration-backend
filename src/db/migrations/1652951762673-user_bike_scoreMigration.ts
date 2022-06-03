import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '../TableName';

export class userBikeScoreMigration1652951762673 implements MigrationInterface {
  public userBikeScoreTable: Table = new Table({
    name: TableName.UserBikeScore,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isGenerated: true,
        generationStrategy: 'increment',
        isPrimary: true,
      },
      {
        name: 'userId',
        type: 'integer',
        isNullable: true,
        isUnique: false,
      },
      {
        name: 'bikeId',
        type: 'integer',
        isNullable: true,
        isUnique: false,
      },
      {
        name: 'score',
        type: 'number',
        isNullable: false,
        default: 0,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.userBikeScoreTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.userBikeScoreTable);
  }
}
