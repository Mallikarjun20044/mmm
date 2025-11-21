import { readFileSync } from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import { migrate } from './pg.js';
import { migrateMySQL } from './mysql.js';
import bcrypt from 'bcryptjs';

async function main() {
  if (!env.DATABASE_URL) {
    console.error('Set DATABASE_URL and DB_ENGINE (pg|mysql) to run migrations.');
    process.exit(1);
  }
  if (env.DB_ENGINE === 'pg') {
    const schemaPath = path.resolve(process.cwd(), 'src', 'db', 'schema.pg.sql');
    const sql = readFileSync(schemaPath, 'utf-8');
    await migrate(sql);
    // seed admin user if absent
    const hash = bcrypt.hashSync('Admin@123', 10);
    const { pool } = await import('./pg.js');
    await pool.query("INSERT INTO users (name,email,password_hash,role) VALUES ('Administrator','admin@example.com',$1,'Admin') ON CONFLICT (email) DO NOTHING", [hash]);
    console.log('PostgreSQL schema migrated and admin seeded.');
    return;
  }
  if (env.DB_ENGINE === 'mysql') {
    const schemaPath = path.resolve(process.cwd(), 'src', 'db', 'schema.mysql.sql');
    const sql = readFileSync(schemaPath, 'utf-8');
    const hash = bcrypt.hashSync('Admin@123', 10);
    const { default: mysql } = await import('mysql2/promise');
    const url = new URL(env.DATABASE_URL);
    const dbName = url.pathname.replace(/^\//,'');
    // Create DB if not exists using a server-level connection (no database selected)
    const serverConn = await mysql.createConnection({ host: url.hostname, port: Number(url.port||3306), user: url.username, password: url.password||undefined });
    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await serverConn.end();
    // Run schema against the DB
    await migrateMySQL(sql);
    // Seed admin user idempotently
    const dbConn = await mysql.createConnection({ host: url.hostname, port: Number(url.port||3306), user: url.username, password: url.password||undefined, database: dbName });
    await dbConn.execute("INSERT INTO users (name,email,password_hash,role) VALUES ('Administrator','admin@example.com',?,'Admin') ON DUPLICATE KEY UPDATE email=email", [hash]);
    await dbConn.end();
    console.log('MySQL schema migrated and admin seeded.');
    return;
  }
  console.error('Unsupported DB_ENGINE:', env.DB_ENGINE);
  process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
