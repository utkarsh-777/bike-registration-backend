/* eslint-disable prettier/prettier */
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'src/data/bikeRegistrationDB',
  entities: ['dist/src/db/entities/*.entity.js'],
  synchronize: true,
  migrations: ['dist/src/db/migrations/*.js'],
};

export default config;
