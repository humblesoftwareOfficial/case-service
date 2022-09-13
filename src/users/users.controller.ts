/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger/dist';

import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { NewUserDto, UpdatePushTokenDto, UserPhoneDto } from './users.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @ApiCreatedResponse({
    description: 'New user successfully registered.',
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request. most often duplicated values such as (phone, email).',
  })
  @Post('/registration')
  async create(@Body() newUserDto: NewUserDto) {
    return this.service.create(newUserDto);
  }

  // @ApiOkResponse({
  //   description: 'Checked.',
  //   type: Boolean,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: 'Internal server error occured.',
  // })
  // @ApiBadRequestResponse({
  //   description: '',
  // })
  // @Post('/verify-phone')
  // async verifyPhoneNumber(@Body() value: UserPhoneDto) {
  //   return this.service.isPhoneNumberRegistered(value);
  // }

  // @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({
  //   description: 'Push token successfully added.',
  //   type: User,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: 'Internal server error occured.',
  // })
  // @ApiNotFoundResponse({
  //   description: 'User not found!',
  // })
  // @Post('/pushtokens')
  // async updatePushTokens(@Body() value: UpdatePushTokenDto) {
  //   return this.service.updatePushToken(value);
  // }
}
