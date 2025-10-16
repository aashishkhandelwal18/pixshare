/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { AllExceptionFilter } from './app/filters/http-exception.filter'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  app.useGlobalFilters(new AllExceptionFilter())
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();