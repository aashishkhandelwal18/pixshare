import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto{
    @ApiProperty({ description: 'User full name' })
    name  : string
    
    @ApiProperty({ description: 'Username for login' })
    username : string
    
    @ApiProperty({ description: 'User password' })
    password  : string
}