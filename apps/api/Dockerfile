FROM node:22-alpine As builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV PRISMA_CLIENT_OUTPUT=/app/dist/generated/prisma
RUN pnpm prisma:generate
RUN pnpm build

# Stage 2: Run the application
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/libs/database/prisma.config.ts ./libs/database/prisma.config.ts
COPY --from=builder /app/libs/database/prisma ./libs/database/prisma
CMD ["sh", "-c", "pnpm prisma:deploy && pnpm start:prod"]
