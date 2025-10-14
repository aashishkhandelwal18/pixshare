import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pixshare/prisma'

@Injectable()
export class AppService {
  constructor(private prismaService : PrismaService){}
  async createGroup(groupData) {
       const groupCreated =   await this.prismaService.group.create(groupData)
  
       const { id : group_id , admin_user } =  groupCreated
       const mappedUserGroup = await this.prismaService.usergroupmapping.create({data:{group_id , "user_id":admin_user}})
       return {mappedUserGroup , groupCreated}
    }
}

