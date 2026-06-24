import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';

import { ProductModule } from './product.module';
import { CartModule } from './cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { LoggerModule } from 'libs/logger/src';
import { DatabaseModule } from '@libs/database';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      expandVariables: true,
      isGlobal: true,
    }),
    DatabaseModule,
    LoggerModule.forRootAsync(),
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ApiResponseInterceptor(reflector),
      inject: [Reflector],
    },
  ],
})
export class ApiModule {}
