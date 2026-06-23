import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { LoggerManager } from 'libs/logger/src';
import { Pool } from 'pg';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = LoggerManager.resolveLogger({
    context: PrismaService.name,
  });
  constructor(private configService: ConfigService) {
    const config = {
      host: configService.get('db.host'),
      port: configService.get('db.port'),
      user: configService.get('db.user'),
      password: configService.get('db.pass'),
      database: configService.get('db.name'),
    };

    const connectionPool = new Pool(config);
    super({
      adapter: new PrismaPg(connectionPool, {
        onConnectionError: (err) => {
          this.logger.error({
            eventName: 'database.error',
            body: {
              err,
            },
          });
        },
        onPoolError: (err) => {
          this.logger.error({
            eventName: 'database.error',
            body: {
              err,
            },
          });
        },
      }),
    });
  }

  async onModuleInit() {
    this.logger.info({
      eventName: 'database.connecting',
      body: {
        msg: 'Connecting to the DB ...',
      },
    });

    try {
      await this.$connect();
      this.logger;
      this.logger.debug({
        eventName: 'database.connected',
        body: {
          ...this.configService.get('db'),
        },
      });
    } catch (err) {
      this.logger.error({
        eventName: 'database.error',
        body: {
          err,
        },
      });
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.debug({
        eventName: 'database.disconnected',
      });
    } catch (err) {
      this.logger.error({
        eventName: 'database.error',
        body: {
          err,
        },
      });
    }
  }
}
