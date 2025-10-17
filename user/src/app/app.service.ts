import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@pixshare/prisma';
import { AuthService } from '@pixshare/auth';

// import { Prisma } from 'generated/prisma';
import { /*User,*/ Prisma } from '@prisma/client';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginDto } from '@pixshare/shared-dtos';
import { S3Service } from '@pixshare/aws';

@Injectable()
export class AppService {
  constructor(private prismaService : PrismaService, private authService: AuthService , private readonly s3Service : S3Service){}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
  async registerUser(data: { name: string; username: string; password: string; image?: string }, file?: Express.Multer.File) : Promise<RegisterResponseDto> {
    try{
      let imageUrl = '';   
      if (file) {
        const key = `user-images/${Date.now()}-${file.originalname}`;
        imageUrl = await this.s3Service.uploadFile('image', key, file.buffer, file.mimetype);
      }
      const userData = {
        ...data,
        image: imageUrl
      };  
      const userCreated = await this.prismaService.user.create({data : userData as any})
      delete (userCreated as any).password
      const token = await this.authService.generateAccessToken({ id: userCreated.id, username: (userCreated as any).username })
      return { username : (userCreated as any).username , user : userCreated , token : token.access_token }  
    
       }catch(er){
      console.log(`Error in the register user service : ${er}`)
      throw new NotFoundException("error in create group service" + er)
    }
  }

  async loginUser(loginDto: LoginDto) : Promise<RegisterResponseDto> {
    try{

      const isUserAvailable = await this.prismaService.user.findUnique({where : {username : loginDto.username} as any})
      if(!isUserAvailable){
        throw new UnauthorizedException("Invalid Creds")
      }
      if(loginDto.password !== (isUserAvailable as any).password){
        throw new UnauthorizedException("Invalid Password")
      }
      delete (isUserAvailable as any).password
      const {access_token} =  await this.authService.generateAccessToken({ id: isUserAvailable.id, username: (isUserAvailable as any).username })
      return {user : isUserAvailable , username : (isUserAvailable as any).username , token : access_token}
    

    }catch(er){
      console.log(`Error in the login user service : ${er}`)
      throw new NotFoundException(`Error in the login user service : ${er}`)
    }
  }
  
  async getUser(){
    return await this.prismaService.user.findMany()
  }
}



