import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppModel } from '../entities/review.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '6543'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [AppModel],
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
    extra: {
      max: 1,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    },
  }),
);
