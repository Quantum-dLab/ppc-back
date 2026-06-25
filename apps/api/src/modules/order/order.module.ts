import { Module } from '@nestjs/common';

import { PrismaOrderRepository } from './infrastructure';
import { ORDER_REPOSITORY } from './domain';

@Module({
  imports: [],
  controllers: [],
  providers: [{
    provide:ORDER_REPOSITORY,
    useClass:PrismaOrderRepository
  }],
  exports: [],
})
export class OrderModule {}
