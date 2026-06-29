import { Module } from '@nestjs/common';

import { PrismaOrderRepository } from './infrastructure';
import { ORDER_REPOSITORY } from './domain';
import {
  CreateOrderUseCase,
  GetUserOrderUseCase,
  ListOrdersUseCase,
  ListUserOrdersUseCase,
  UpdateOrderStatusUseCase,
} from './application/use-cases';
import { AdminOrdersController } from './presentation/admin-orders.controller';
import { UserOrdersController } from './presentation/user-orders.controller';
import { ProductModule } from '../product.module';

const ORDER_USE_CASES = [
  CreateOrderUseCase,
  GetUserOrderUseCase,
  ListOrdersUseCase,
  ListUserOrdersUseCase,
  UpdateOrderStatusUseCase,
];

@Module({
  imports: [ProductModule],
  controllers: [UserOrdersController, AdminOrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: PrismaOrderRepository,
    },
    ...ORDER_USE_CASES,
  ],
  exports: [ORDER_REPOSITORY, ...ORDER_USE_CASES],
})
export class OrderModule {}
