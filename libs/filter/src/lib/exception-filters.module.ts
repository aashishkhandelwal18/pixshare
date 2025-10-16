import { Module } from '@nestjs/common';
import { AllExceptionFilter } from './http-exception.filter'

@Module({
  controllers: [],
  providers: [AllExceptionFilter],
  exports: [AllExceptionFilter],})
export class ExceptionFiltersModule {}