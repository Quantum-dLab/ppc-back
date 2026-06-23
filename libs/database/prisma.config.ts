import { defineConfig, env } from 'prisma/config';
import { config } from 'dotenv';
import { join } from 'path';
import { expand } from 'dotenv-expand';
expand(config({ path: join(process.cwd(), '.env')}))
export default defineConfig({
  schema: 'prisma/',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsc ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL
  },
});
