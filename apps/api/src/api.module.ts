import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaModule } from '@libs/shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
