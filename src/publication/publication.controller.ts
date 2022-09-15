/* eslint-disable prettier/prettier */
import { Controller, Body, Post, UseGuards, Param, Get, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicationService } from './publication.service';
import { Publication } from './publication.entity';
import { NewPublicationDto, PublicationsListDto, UpdatePublicationDto } from './publication.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { isValidPublicationCode } from './publication.helper';
import { InvalidCodeException } from '../exceptions/invalicode.exception.filter';

@ApiTags('Publications')
@UseGuards(JwtAuthGuard)
@Controller('publication')
export class PublicationController {
  constructor(private service: PublicationService) {}

  @ApiCreatedResponse({
    description: 'List of publications.',
    type: Publication,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/list')
  async list(@Body() value: PublicationsListDto) {
    return this.service.list(value);
  }

  @ApiCreatedResponse({
    description: 'New publication successfully created.',
    type: Publication,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/new')
  async create(@Body() value: NewPublicationDto) {
    return this.service.create(value);
  }

  @ApiOkResponse({
    description: '',
    type: Publication,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid publication code.',
  })
  @ApiNotFoundResponse({
    description: 'Publication not found.',
  })
  @Get(':code')
  async findOne(@Param('code') code: string) {
    if (!isValidPublicationCode(code)) {
      throw new InvalidCodeException('Publication code is incorrect!');
    }
    return this.service.findOne(code);
  }

  @ApiOkResponse({
    description: 'Publication successfully updated.',
    type: Publication,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiNotFoundResponse({
    description: 'Publication not found.',
  })
  @Patch(':code')
  async update(
    @Param('code') code: string,
    @Body() value: UpdatePublicationDto,
  ) {
    if (!isValidPublicationCode(code)) {
      throw new InvalidCodeException('Publication code is incorrect!');
    }
    return this.service.update(code, value);
  }
}
