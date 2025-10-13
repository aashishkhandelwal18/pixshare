import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@pixshare/prisma'; // Alias from libs/prisma
// import { AuthModule } from '../../auth.module';
import { AuthModule } from '@pixshare/auth';
import { AwsModule } from '@pixshare/aws'


@Module({
  imports: [PrismaModule, AuthModule , AwsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}