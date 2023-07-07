import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const configForTypeOrm: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  autoLoadEntities: false,
  synchronize: false,
  ssl: true,
};

export const defaultTypeOrm: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_FOR_ENTITIES,
  autoLoadEntities: true,
  synchronize: true,
  //ssl: true,
};
