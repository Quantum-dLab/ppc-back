import pino, { type Logger as PinoBase } from 'pino';
import { PinoAppLogger } from './pino.logger';
import { ConfigService } from '@nestjs/config';
import { Injectable, LogLevel } from '@nestjs/common';
import { AppLogger, LoggerDriver } from '../types';

@Injectable()
export class PinoDriver implements LoggerDriver {
    readonly name = 'pino';

    constructor(
        private readonly root: PinoBase,
    ) {}

    createRootLogger(): AppLogger {
        return new PinoAppLogger(this.root);
    }


    
}
