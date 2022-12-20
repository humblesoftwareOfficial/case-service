/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { EUserGender } from '../core/entities/User';

import { URLValidator } from '../shared/url.helper';
import { EAccountType, UserCodeValidator } from './users.helper';

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
  @IsNotEmpty({ message: 'Account type cannot be empty.' })
  @IsEnum(EAccountType, {
    message: 'User account type is required!',
  })
  accountType: EAccountType;

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
  @IsNotEmpty({ message: 'Account type cannot be empty.' })
  @IsEnum(EAccountType, {
    message: 'User account type is required!',
  })
  accountType: EAccountType;

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

export class FollowAccountDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: 'Account to follow is required.' })
  @Validate(UserCodeValidator)
  account: string;
}

export class UnFollowAccountDto extends FollowAccountDto {

}
