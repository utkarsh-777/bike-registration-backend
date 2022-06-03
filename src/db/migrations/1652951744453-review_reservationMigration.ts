import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '../TableName';

export class reviewReservationMigration1652951744453
  implements MigrationInterface
{
  public reviewReservationTable: Table = new Table({
    name: TableName.ReviewReservation,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isGenerated: true,
        generationStrategy: 'increment',
        isPrimary: true,
      },
      {
        name: 'reservationId',
        type: 'integer',
        isNullable: true,
        isUnique: true,
      },
      {
        name: 'comment',
        type: 'string',
        isNullable: true,
        isUnique: false,
      },
      {
        name: 'rating',
        type: 'number',
        isNullable: false,
        default: 0,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.reviewReservationTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.reviewReservationTable);
  }
}
