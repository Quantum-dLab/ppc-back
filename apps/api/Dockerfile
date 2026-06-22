FROM node:22-alpine As builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV PRISMA_CLIENT_OUTPUT=/app/dist/generated/prisma
RUN npx prisma generate
RUN npm run build

# Stage 2: Run the application
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/libs/shared/src/infrastructure/prisma/schema ./libs/shared/src/infrastructure/prisma/schema
COPY --from=builder /app/libs/shared/src/infrastructure/prisma/migrations ./libs/shared/src/infrastructure/prisma/migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]