import { Body, Controller, Get , Post , UseGuards , Headers } from '@nestjs/common';
import { AppService } from './app.service';

import { AuthService, JwtAuthGuard } from "@pixshare/auth"
import { CreateGroupDto } from '@pixshare/shared-dtos';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService , private readonly authService: AuthService) {}


  @UseGuards(JwtAuthGuard)  
  @Post('/create-group')
  async createGroup(@Body() createGroupDto : CreateGroupDto , @Headers('authorization') authHeader: string) {
    const token   = authHeader?.split(" ")[1]    
    const {username , sub : id} = this.authService.customDecode(token)
    const groupPayload = {
      name : createGroupDto.name,
      admin_user : id,
      admin_name : username
    }
    
    const groupCreated = this.appService.createGroup({data : groupPayload});
    return groupCreated
  }
}