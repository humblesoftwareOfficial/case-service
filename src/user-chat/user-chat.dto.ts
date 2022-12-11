/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewUserChatDto {
  @IsNotEmpty({ message: 'User name is required.' })
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'User password is required.' })
  @IsString()
  password: string;

  @IsOptional()
  @IsArray({
    message: 'Tokens value must an array of valid token value',
  })
  push_tokens: string[];
}
