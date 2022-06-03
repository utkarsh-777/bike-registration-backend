import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '../TableName';

export class userMigration1652352457282 implements MigrationInterface {
  public userTable: Table = new Table({
    name: TableName.User,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isGenerated: true,
        generationStrategy: 'increment',
        isPrimary: true,
      },
      {
        name: 'full_name',
        type: 'string',
        isNullable: true,
        isUnique: false,
      },
      {
        name: 'email',
        type: 'string',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'password',
        type: 'string',
        isNullable: false,
      },
      {
        name: 'role',
        type: 'enum',
        enum: ['manager', 'regular'],
        default: 'regular',
      },
      {
        name: 'reservation',
        type: 'string',
        default: '[]',
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.userTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.userTable);
  }
}
