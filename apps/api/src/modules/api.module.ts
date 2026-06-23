import { Module } from '@nestjs/common';
import { ApiController } from '../api.controller';
import { ApiService } from '../api.service';
import { PrismaModule } from '@libs/shared/infrastructure/prisma/prisma.module';
import { ProductModule } from './product.module';
import { CartModule } from './cart.module';

@Module({
  imports: [PrismaModule, ProductModule, CartModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
