import { registerAs } from "@nestjs/config";


export const DatabaseConfig=registerAs('db', () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  pass: process.env.DATABASE_PASS,
  user: process.env.DATABASE_USER,
  name: process.env.DATABASE_NAME,
}));
