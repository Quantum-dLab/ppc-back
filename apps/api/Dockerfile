# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PRISMA_CLIENT_OUTPUT="/app/dist/generated/prisma"

RUN apk add --no-cache dumb-init openssl
ARG PNPM_VERSION=10.12.1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate


# -----------------------------
# Stage 1: Install dependencies
# -----------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml* ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile


# -----------------------------
# Stage 2: Build application
# -----------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma generate --config ./prisma.config.ts

RUN pnpm build


# -----------------------------
# Stage 3: Production dependencies only
# -----------------------------
FROM base AS prod-deps

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml* ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile \
    && pnpm store prune


# -----------------------------
# Stage 4: Runtime
# -----------------------------
FROM base AS runner

ENV NODE_ENV=production
ENV PRISMA_CLIENT_OUTPUT="/app/dist/generated/prisma"

WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

COPY --from=builder --chown=node:node /app/dist ./dist

#  Prisma migrate deploy
COPY --from=builder --chown=node:node /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=node:node /app/libs/shared/src/infrastructure/prisma/schema ./libs/shared/src/infrastructure/prisma/schema
COPY --from=builder --chown=node:node /app/libs/shared/src/infrastructure/prisma/migrations ./libs/shared/src/infrastructure/prisma/migrations

USER node

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "pnpm prisma migrate deploy --config ./prisma.config.ts && pnpm start:prod"]ف