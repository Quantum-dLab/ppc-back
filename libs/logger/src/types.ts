
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface BaseBindings {

    env?: string; //dev, prod, test
    context?: string;
    module?: string;
    userId?: string | number;
}

export type LogRecord = {
    eventName?: string;
    body?: Record<string, any>;
    bindings?: BaseBindings;
};

export interface AppLogger {
    child(bindings?: BaseBindings): AppLogger;
    trace(obj: LogRecord): void;
    debug(obj: LogRecord): void;
    info(obj: LogRecord): void;
    warn(obj: LogRecord): void;
    error(obj: LogRecord): void;
    fatal(obj: LogRecord): void;
}
export interface LoggerDriver {
    readonly name: string;
    createRootLogger(): Promise<AppLogger> | AppLogger;
}
