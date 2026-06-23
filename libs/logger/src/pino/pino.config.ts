import { registerAs } from "@nestjs/config";



export const pinoConfig = registerAs('pino', () => ({
    httpLogging: process.env.HTTP_LOGGING === 'true',
    defaultDebugLevel: 'debug',
    defaultErrorLevel: 'error',
}));