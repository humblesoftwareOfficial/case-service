/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Validate } from 'class-validator';


export class AuthDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty({ message: "User's email cannot be empty. " })
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty({ message: "User's card cannot be empty." })
  phone?: string;

  @IsNotEmpty({ message: "User's password is required. " })
  password: string;
}

export class TokenVerificationDto {
  @IsNotEmpty({ message: 'Value cannot be empty ' })
  token: string;
}
