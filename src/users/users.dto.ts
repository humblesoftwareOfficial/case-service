/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { EUserGender } from 'src/core/entities/User';

import { UserCodeValidator } from './users.helper';

export class NewUserDto {
  @IsNotEmpty({ message: 'User first name is required.' })
  firstName: string;

  @IsNotEmpty({ message: 'User last name is required.' })
  lastName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'User gender cannot be empty.' })
  @IsEnum(EUserGender, {
    message: 'User gender is required!',
  })
  gender: EUserGender;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid User email.' })
  email: string;

  @IsString()
  phone: string;


  @IsNotEmpty({ message: 'User password is required.' })
  password: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsArray({
    message: 'Tokens value must an array of valid token value',
  })
  push_tokens: string[];
}

export class UpdatePushTokenDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: 'Token Value is required' })
  tokenValue: string;
}

export class UserPhoneDto {
  @IsNotEmpty({ message: 'User phone is required.' })
  @IsString()
  phone: string;
}

export class UserCodeDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;
}
