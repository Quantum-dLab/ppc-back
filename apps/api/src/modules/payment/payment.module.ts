import { Module } from '@nestjs/common';
import { PrismaPaymentRepository } from './infrastructure';
import { PAYMENT_REPOSITORY } from './domain';

@Module({

  controllers: [],
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PrismaPaymentRepository,
    },
  ],
 
})
export class PaymentModule {}
