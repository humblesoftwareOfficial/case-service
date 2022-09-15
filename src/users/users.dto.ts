/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { EUserGender } from 'src/core/entities/User';

import { UserCodeValidator } from './users.helper';
import { URLValidator } from '../shared/url.helper';

export class NewUserDto {
  @IsNotEmpty({ message: 'User first name is required.' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'User last name is required.' })
  @IsString()
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
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'User pseudo is required.' })
  @IsString()
  pseudo: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  @Validate(URLValidator)
  profile_picture: string;

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

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'User first name is required.' })
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'User last name is required.' })
  @IsString()
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

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsNotEmpty({ message: 'User password is required.' })
  @IsString()
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: 'User password is required.' })
  @IsString()
  pseudo: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  @Validate(URLValidator)
  profile_picture: string;

  @IsOptional()
  @IsArray({
    message: 'Tokens value must an array of valid token value',
  })
  push_tokens: string[];
}
