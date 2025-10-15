import { Body, Controller, Get , Post , UseGuards , Headers, Req } from '@nestjs/common';
import { AppService } from './app.service';

import { AuthService, JwtAuthGuard } from "@pixshare/auth"
import { CreateGroupDto , CreateGroupResponseDto } from '@pixshare/shared-dtos';
import { ApiResponse , FetchGroupResponseDto } from '@pixshare/shared-dtos'
import { ResponseMessage } from '@pixshare/shared-constants'
import { Request } from 'express'

@Controller('/groups')

export class AppController {
  constructor(private readonly appService: AppService , private readonly authService: AuthService) {}
  @UseGuards(JwtAuthGuard)  
  @Post('/create-group')
  async createGroup(@Body() createGroupDto : CreateGroupDto , @Headers('authorization') authHeader: string , @Req() req: Request  ) :  Promise<ApiResponse<CreateGroupResponseDto>>  {
    
    const {username , sub : id} = this.authService.customDecode(authHeader)
    const groupPayload = {
      name : createGroupDto.name,
      admin_user : id,
      admin_name : username
    }   
    const {mappedUserGroup , groupCreated} = await this.appService.createGroup({data : groupPayload});
    return {status : true, message : ResponseMessage.group.CREATED, data: {mappedUserGroup , groupCreated}}
  }

  // for dashboard
  @UseGuards(JwtAuthGuard)
  @Get('/fetch-group')
  async fetchGroup(@Headers('authorization') authHeader: string ,  @Req() req: Request) :  Promise<ApiResponse<FetchGroupResponseDto[]>> {    
    try{
      
      const {username ,  sub : user_id} = this.authService.customDecode(authHeader)
      const groupList = await this.appService.fetchGroup(user_id)
      if(groupList.length > 0){
        return { status : true , message : ResponseMessage.group.LIST , data :groupList} 
      }else{ 

        return { status : true , message : ResponseMessage.group.NOGROUPFOUND , data :[]}                               
      }  
    }catch(er){
      console.log(`Error in group controller : ${er}`)
    }
}
}

// Worked on the fetch group API in which added handeling if no groups are there for that user.
// Centalized the responses for the proper output and low chances of typo.
// Done the group route with some extra handeling which I have searched.
// Have to centralised the apps other modules and add exception handelings also.