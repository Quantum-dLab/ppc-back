import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'body-parser';
import rateLimit from 'express-rate-limit';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { AllExceptionFilter } from './common/filters/exception.filter';
import { SetupSwagger } from './configs/swagger.config';
import { ApiModule } from './modules/api.module';
import { NestLoggerAdapter } from 'libs/logger/src/nest.logger.adapter';
async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(ApiModule);
  app.use(json());
  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 1000,
      message: 'Too many requests from this IP address, try again later',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  if(process.env.USE_APP_LOGGER_FOR_NEST==='true'){
    app.useLogger(new NestLoggerAdapter());
  }
  SetupSwagger(app);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Application is listening on port ${port}`);
  Logger.log(`Swagger docs : http://localhost:${port}/docs`);
}
bootstrap();
