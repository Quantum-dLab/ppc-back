import { registerAs } from "@nestjs/config";

export const loggerConfig = registerAs('logger', () => ({
    driver: process.env.LOG_DRIVER || 'pino',
    level: process.env.LOG_LEVEL || 'info',
    useAppLoggerForNest: process.env.USE_APP_LOGGER_FOR_NEST === 'true',
}));
