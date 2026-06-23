import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/shared/infrastructure/prisma/prisma.module';
import { ProductModule } from './product.module';
import { CartModule } from './cart.module';
import { LoggerModule } from 'libs/logger/src';

@Module({
  imports: [PrismaModule, LoggerModule.forRootAsync(), ProductModule, CartModule],
})
export class ApiModule {}
