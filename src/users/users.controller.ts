/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards, Patch } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger/dist';

import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { InvalidCodeException } from '../exceptions/invalicode.exception.filter';
import { NewUserDto, UpdatePushTokenDto, UserPhoneDto, UpdateUserDto } from './users.dto';
import { User } from './users.entity';
import { isValidUserCode } from './users.helper';
import { UsersService } from './users.service';

@ApiTags('Users')
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

  @ApiOkResponse({
    description: '',
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid user code.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':code')
  async findOne(@Param('code') code: string) {
    if (!isValidUserCode(code)) {
      throw new InvalidCodeException('User code is incorrect!');
    }
    return this.service.findOne(code);
  }

  @ApiOkResponse({
    description: 'Checked.',
    type: Boolean,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: '',
  })
  @Post('/verify-phone')
  async verifyPhoneNumber(@Body() value: UserPhoneDto) {
    return this.service.isPhoneNumberRegistered(value);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Push token successfully added.',
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiNotFoundResponse({
    description: 'User not found!',
  })
  @Post('/pushtokens')
  async updatePushTokens(@Body() value: UpdatePushTokenDto) {
    return this.service.updatePushToken(value);
  }

  @ApiOkResponse({
    description: 'User successfully updated.',
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @Patch(':code')
  async update(
    @Param('code') code: string,
    @Body() value: UpdateUserDto,
  ) {
    if (!isValidUserCode(code)) {
      throw new InvalidCodeException('User code is incorrect!');
    }
    return this.service.update(code, value);
  }

  @ApiOkResponse({
    description: '',
    type: Boolean,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid user code.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/ispseudoavailable/:pseudo')
  async isAvailablePseudo(@Param('pseudo') pseudo: string) {
    return this.service.isPseudoAvailable(pseudo);
  }
}
