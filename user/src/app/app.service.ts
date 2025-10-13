import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      // take a image as a input and store it in S3 and store its s3 url in DB
      let imageUrl = '';
      
      if (file) {
        // Generate unique key for the image
        const key = `user-images/${Date.now()}-${file.originalname}`;
        // Upload image to S3 and get the URL
        imageUrl = await this.s3Service.uploadFile('image', key, file.buffer, file.mimetype);
      }
      
      // Create user with image URL
      const userData = {
        ...data,
        image: imageUrl
      };
      
      const userCreated = await this.prismaService.user.create({data : userData as any})
      delete (userCreated as any).password
      const token = await this.authService.generateAccessToken({ id: userCreated.id, username: (userCreated as any).username })
      return { username : (userCreated as any).username , user : userCreated , token : token.access_token }  
  }

  async loginUser(loginDto: LoginDto) : Promise<RegisterResponseDto> {
    const isUserAvailable = await this.prismaService.user.findUnique({where : {username : loginDto.username} as any})
    if(!isUserAvailable){
      throw new UnauthorizedException("Invalid Creds")
    }
    if(loginDto.password !== (isUserAvailable as any).password){
      throw new UnauthorizedException("Invalid Password")
    }
    delete (isUserAvailable as any).password
    const {access_token} =  await this.authService.generateAccessToken({ id: isUserAvailable.id, username: (isUserAvailable as any).username })
    // logic of the login
    return {user : isUserAvailable , username : (isUserAvailable as any).username , token : access_token}
  }
  
  async getUser(){
    const userCreated = await this.prismaService.user.findMany()
    console.log(` get users with auth userCreated`)
    console.log(userCreated)
    return userCreated
  }
}
