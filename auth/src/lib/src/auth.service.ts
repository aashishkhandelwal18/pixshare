import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(user: any, password: string): Promise<any> {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...result } = user;
    return result;
  }
  async generateAccessToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload), };
  }
  customDecode(authHeader: string): any {
    try {
      const token   = authHeader?.split(" ")[1]    
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}