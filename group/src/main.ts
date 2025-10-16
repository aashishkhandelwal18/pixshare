import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { AllExceptionFilter } from '@pixshare/exception-filters'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  app.useGlobalFilters(new AllExceptionFilter())
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${globalPrefix}/groups`);
}
bootstrap();