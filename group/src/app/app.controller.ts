import { Body, Controller, Get , Post , UseGuards , Headers, Req, NotFoundException, BadRequestException } from '@nestjs/common';
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
    try{

      const {username , sub : id} = this.authService.customDecode(authHeader)
      const groupPayload = {
        name : createGroupDto.name,
        admin_user : id,
        admin_name : username
      }   
      const {mappedUserGroup , groupCreated} = await this.appService.createGroup({data : groupPayload});
      return {status : true, message : ResponseMessage.group.CREATED, data: {mappedUserGroup , groupCreated}}
    } catch(er){
        throw new NotFoundException("error in create group" + er)
    }   
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
      throw new BadRequestException(`Error in group controller : ${er}`)
    }
}
}

