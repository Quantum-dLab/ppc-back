import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './database.config';
import { PrismaService } from './prisma.service';
@Global()
@Module({
  imports:[ConfigModule.forFeature(DatabaseConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
