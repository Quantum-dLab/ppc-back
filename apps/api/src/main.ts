import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { PrismaService } from '@libs/shared/infrastructure/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const prisma = app.get<PrismaService>(PrismaService);
  const users = await prisma.user.findMany();
  console.log(`Database connected. Users found: ${users.length}`);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
