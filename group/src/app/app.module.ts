import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { AuthModule } from '@pixshare/auth';
import { PrismaModule  } from '@pixshare/prisma';
@Module({
  imports: [AuthModule , PrismaModule],
  controllers: [AppController],
  providers: [AppService , PrismaModule],
})
export class AppModule {}
