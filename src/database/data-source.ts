import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const datasourceOptions: {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} = {
  type: 'postgres',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 0,
  username: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
};

export const AppDataSource = new DataSource({
  ...datasourceOptions,
  migrations: ['src/database/migrations/*{.ts,.js}'],
  entities: ['src/common/**/**.entity{.ts,.js}'],
  ssl:
    process.env.APP_ENV === 'local'
      ? false
      : {
          ca: process.env.CACERT,
        },
});
