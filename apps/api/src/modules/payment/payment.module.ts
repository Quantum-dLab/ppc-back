import { Module } from '@nestjs/common';
import { PrismaPaymentRepository } from './infrastructure';
import { PAYMENT_REPOSITORY } from './domain';
import {
  CreatePaymentUseCase,
  ListPaymentsUseCase,
  ListUserPaymentHistoryUseCase,
  VerifyPaymentUseCase,
} from './application/use-cases';
import { AdminPaymentsController } from './presentation/admin-payments.controller';
import { UserPaymentsController } from './presentation/user-payments.controller';
import { OrderModule } from '../order/order.module';

const PAYMENT_USE_CASES = [
  CreatePaymentUseCase,
  ListPaymentsUseCase,
  ListUserPaymentHistoryUseCase,
  VerifyPaymentUseCase,
];

@Module({
  imports: [OrderModule],
  controllers: [UserPaymentsController, AdminPaymentsController],
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PrismaPaymentRepository,
    },
    ...PAYMENT_USE_CASES,
  ],
  exports: [PAYMENT_REPOSITORY, ...PAYMENT_USE_CASES],
})
export class PaymentModule {}
