import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as NestPinoLoggerModule } from 'nestjs-pino';
import { PINO_LOGGER_DRIVER, PINO_ROOT } from './pino.provider';
import pino, { Logger } from 'pino';
import { IncomingMessage } from 'http';
import { randomUUID } from 'crypto';
import { PinoAppLogger } from './pino.logger';
import { AppLogger } from '../types';
import { PinoDriver } from './pino.driver';
import { pinoConfig } from './pino.config';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(pinoConfig),
    NestPinoLoggerModule.forRootAsync({
      inject: [ConfigService, PINO_ROOT],
      useFactory: (cfg: ConfigService, root: Logger) => {
        const httpEnabled =
          cfg.get<string>('logger.driver') === 'pino' &&
          cfg.get<boolean>('pino.httpLogging');

        return {
          pinoHttp: {
            logger: root,
            autoLogging: httpEnabled
              ? {
                  ignore: (req: IncomingMessage) =>
                    /^\/(health|metrics)/.test(req.url ?? ''),
                }
              : false,
            genReqId: (req: IncomingMessage) => {
              if (req.id !== undefined) {
                return typeof req.id === 'string'
                  ? req.id
                  : typeof req.id === 'number'
                    ? String(req.id)
                    : randomUUID();
              }
              return randomUUID();
            },
            customProps: (req: IncomingMessage) => ({
              requestId:
                req.id !== undefined
                  ? typeof req.id === 'string'
                    ? req.id
                    : typeof req.id === 'number'
                      ? String(req.id)
                      : undefined
                  : undefined,
            }),
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: PINO_ROOT,
      inject: [ConfigService],
      useFactory: pinoRootFactory,
    },
    {
      provide: PINO_LOGGER_DRIVER,
      inject: [PINO_ROOT],
      useFactory: (root: Logger) => new PinoDriver(root),
    },
    {
      provide: 'APP_LOGGER_ROOT',
      inject: [PINO_ROOT],
      useFactory: (root: pino.Logger): AppLogger => new PinoAppLogger(root),
    },
  ],
  exports: [PINO_LOGGER_DRIVER, PINO_ROOT, 'APP_LOGGER_ROOT'],
})
export class PinoLoggerModule {}


function pinoRootFactory(cfg: ConfigService) {
  const level = cfg.get<string>('LOG_LEVEL') ?? 'info';
  return pino({level})
}
