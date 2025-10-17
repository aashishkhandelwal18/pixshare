import { Body, Controller, Get, NotFoundException, Post , UnauthorizedException, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';

import { RegisterDto } from './dto/register.dto'
import { ApiResponse } from './dto/api-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginDto } from '@pixshare/shared-dtos'
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@pixshare/auth'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as multer from 'multer';
import { FileValidationPipe } from './pipes/file-validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('/user')
  @UseInterceptors(FileInterceptor('image', { storage : multer.memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({  
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  async registerUser(@Body() registerDto : RegisterDto , @UploadedFile(FileValidationPipe) file: Express.Multer.File) : Promise<ApiResponse<RegisterResponseDto>>{
    try{
      const userData = {
        name: registerDto.name,
        username: registerDto.username,
        password: registerDto.password,
        image: '' // Will be set by the service after S3 upload
      };
      const { username , user , token  } = await  this.appService.registerUser(userData, file)
      if(username.length > 0 && username.length > 0){
        return {status: true,message: "User Registered Successfully",data : {token : token,user : user,username : username}}
      }else{
        return {status: false,message: "Internal Server error",data : {token : "",user : "",username : ""}}
      }
    }catch(er){
            throw new NotFoundException(`Error in the register user controller : ${er}`)
    }
  }

  @Post('/login')
  async loginUser(@Body() loginDto : LoginDto) : Promise<ApiResponse<RegisterResponseDto>>{
    try{
      const { username , user , token  } = await  this.appService.loginUser(loginDto)
      console.log(`username`)
      console.log(username)
      if(username?.length > 0 && username?.length > 0){
        return {status: true,message: "User Login Successfully",data : {  token : token,  user : user,  username : username}}
      }else{
        throw new UnauthorizedException()
      }
    }catch(er){
        throw new UnauthorizedException("Invalid creds: ")
    }
  }

  @Get('/getusers')
  @UseGuards(JwtAuthGuard)
  async getUser() {
    return await  this.appService.getUser()
  }
}
// Improve the respnses of the API majorly login and register.
// Started creating the new workflow for the sending request .
// Integrated SNS and SQS for the messaging between both services.
// For next working day have to Integrate the API which can send message to queue.