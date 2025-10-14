import { Body, Controller, Get , Post , UseGuards , Headers } from '@nestjs/common';
import { AppService } from './app.service';

import { AuthService, JwtAuthGuard } from "@pixshare/auth"
import { CreateGroupDto , CreateGroupResponseDto } from '@pixshare/shared-dtos';
import { ApiResponse } from '@pixshare/shared-dtos'
@Controller()
export class AppController {
  
  constructor(private readonly appService: AppService , private readonly authService: AuthService) {}
  @UseGuards(JwtAuthGuard)  
  @Post('/create-group')
  async createGroup(@Body() createGroupDto : CreateGroupDto , @Headers('authorization') authHeader: string) :  Promise<ApiResponse<CreateGroupResponseDto>>  {
    const token   = authHeader?.split(" ")[1]    
    const {username , sub : id} = this.authService.customDecode(token)
    const groupPayload = {
      name : createGroupDto.name,
      admin_user : id,
      admin_name : username
    }   
    const {mappedUserGroup , groupCreated} = await this.appService.createGroup({data : groupPayload});
    return {status : true, message : "group Created", data: {mappedUserGroup , groupCreated}}
  }
  // for dashboard
  @UseGuards(JwtAuthGuard)
  @Get('/fetch-group')
  async fetchGroup(){    
    // code to fetch the groups on userid from mapped user (handle admin user also)
    // Centralize the return response body accordin to the DTO's
  }
}