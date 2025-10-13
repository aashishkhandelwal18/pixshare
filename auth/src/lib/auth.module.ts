import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './src/auth.service'
@Module({
  imports : [
    PassportModule,

    JwtModule.register({
      secret : "process.env.JWT_SECRET",
      signOptions : {expiresIn : '1d'}
    })
  ],
  controllers: [],
  providers: [JwtStrategy , AuthService],
  exports: [JwtStrategy , JwtModule , AuthService],


})
export class AuthModule {}

