import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pixshare/prisma'

@Injectable()
export class AppService {
  constructor(private prismaService : PrismaService){}
  async createGroup(groupData) {

      return await this.prismaService.group.create(groupData)
  
    }
}
