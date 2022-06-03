import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '../TableName';

export class reservationMigration1652951685392 implements MigrationInterface {
  public reservationTable: Table = new Table({
    name: TableName.Reservation,
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
        name: 'status',
        type: 'string',
        isNullable: false,
        default: 'active',
      },
      {
        name: 'reservationStartDate',
        type: 'string',
        isNullable: false,
        isUnique: false,
      },
      {
        name: 'reservationEndDate',
        type: 'string',
        isNullable: false,
        isUnique: false,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.reservationTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.reservationTable);
  }
}
