import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '../TableName';

export class bikeMigration1652363292708 implements MigrationInterface {
  public bikeTable: Table = new Table({
    name: TableName.Bike,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isGenerated: true,
        generationStrategy: 'increment',
        isPrimary: true,
      },
      {
        name: 'model',
        type: 'string',
        isNullable: false,
        isUnique: false,
      },
      {
        name: 'color',
        type: 'string',
        isNullable: false,
      },
      {
        name: 'location',
        type: 'string',
        isNullable: false,
      },
      {
        name: 'isAvailable',
        type: 'boolean',
        default: true,
      },
      {
        name: 'avgRating',
        type: 'float',
        default: 0,
      },
      {
        name: 'userId',
        type: 'integer',
        default: -1,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.bikeTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.bikeTable);
  }
}
