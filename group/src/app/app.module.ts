import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { AuthModule } from '@pixshare/auth';
import { PrismaModule  } from '@pixshare/prisma';
import { ExceptionFiltersModule } from '@pixshare/exception-filters'

@Module({
  imports: [AuthModule , PrismaModule , ExceptionFiltersModule ],
  controllers: [AppController],
  providers: [AppService , PrismaModule],
})
export class AppModule {}
