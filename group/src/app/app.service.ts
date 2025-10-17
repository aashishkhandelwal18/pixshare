import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@pixshare/prisma'

@Injectable()
export class AppService {
  constructor(private prismaService : PrismaService){}
  async createGroup(groupData) {
    try{

      
      const groupCreated =   await this.prismaService.group.create(groupData)
 
      const { id : group_id , admin_user } =  groupCreated
      const mappedUserGroup = await this.prismaService.usergroupmapping.create({data:{group_id , "user_id":admin_user}})
      return {mappedUserGroup , groupCreated}
    }catch(er){
      console.log("error in create group service" + er)
      throw new NotFoundException("error in create group service" + er)
    }
    }

      async fetchGroup(user_id){
        try{
          const existingGroup  =   await this.prismaService.usergroupmapping.findMany({where : {user_id}})          
          return existingGroup 
        }catch(er){
          console.log(`Error in the ferchGroup : ${er}`)
          throw new NotFoundException("error in create group service" + er)
        }
  }
}