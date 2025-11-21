import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 3001),
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  DB_FILE: process.env.DB_FILE || 'data.json',
  DB_ENGINE: (process.env.DB_ENGINE || 'json') as 'json' | 'pg' | 'mysql',
  DATABASE_URL: process.env.DATABASE_URL || ''
};
