import { Module, Global, DynamicModule } from '@nestjs/common';
import { PinoLoggerModule } from './pino/pino.module';
import { LoggerDriverRegistry } from './logger.registry';
import { LoggerManager } from './log.manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PINO_LOGGER_DRIVER } from './pino/pino.provider';
import { PinoDriver } from './pino/pino.driver';
import { loggerConfig } from './logger.config';

@Global()
@Module({})
export class LoggerModule {
  static forRootAsync(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [PinoLoggerModule, ConfigModule.forFeature(loggerConfig)],
      providers: [
        LoggerDriverRegistry,
        {
          provide: LoggerManager, // facade
          inject: [ConfigService, LoggerDriverRegistry, PINO_LOGGER_DRIVER],
          useFactory: async (
            cfg: ConfigService,
            reg: LoggerDriverRegistry,
            pinoDriver: PinoDriver,
          ) => {
            reg.register(pinoDriver); //register driver
            const chosen: string = cfg.get<string>('logger.driver') ?? 'pino';
            await reg.init(chosen);
            const manager = new LoggerManager(reg);
            LoggerManager.registerFactory(() => manager.logger());
            return manager;
          },
        },
      ],
      exports: [LoggerManager, LoggerDriverRegistry],
    };
  }
}
