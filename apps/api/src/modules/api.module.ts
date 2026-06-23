import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/shared/infrastructure/prisma/prisma.module';
import { ProductModule } from './product.module';
import { CartModule } from './cart.module';

@Module({
  imports: [PrismaModule, ProductModule, CartModule],
})
export class ApiModule {}
