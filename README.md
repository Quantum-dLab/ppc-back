# PPC Back

NestJS backend for PPC with PostgreSQL, Redis, Prisma, and pnpm.

## Requirements

- Node.js 22+
- pnpm 11.9+
- Docker and Docker Compose

## Environment

Create your local environment file from the example:

```bash
cp .env.example .env
```

For Docker Compose, keep these service hostnames:

```env
DATABASE_HOST=postgres
REDIS_URL=redis://:${REDIS_PASS}@redis:6379
```

`PORT` is the port inside the API container. `APP_PORT` is the host port exposed by Docker Compose.

## Run With Docker

Build and start the full stack:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up --build -d
```

Stop services:

```bash
docker compose down
```

Remove database and Redis volumes:

```bash
docker compose down -v
```

The API is available at:

```text
http://localhost:3001
http://localhost:3001/docs
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Generate Prisma Client:

```bash
pnpm prisma:generate
```

Start the app in watch mode:

```bash
pnpm start:dev
```

Build for production:

```bash
pnpm build
```

Start the production build:

```bash
pnpm start:prod
```

## Prisma

Deploy migrations:

```bash
pnpm prisma:deploy
```

Create a development migration:

```bash
pnpm prisma:migrate
```

The Prisma schema lives in `libs/database/prisma`.
