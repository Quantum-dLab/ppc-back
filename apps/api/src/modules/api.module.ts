import { Module } from '@nestjs/common';

import { ProductModule } from './product.module';
import { CartModule } from './cart.module';
import { AuthModule } from './auth.module';
import { LoggerModule } from 'libs/logger/src';
import { DatabaseModule } from '@libs/database';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      expandVariables: true,
      isGlobal: true,
    }),
    DatabaseModule,
    LoggerModule.forRootAsync(),
    AuthModule,
    ProductModule,
    CartModule,
  ],
})
export class ApiModule {}
