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
