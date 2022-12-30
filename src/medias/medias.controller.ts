/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Media } from './medias.entity';
import { MediasService } from './medias.service';
import { NewMediaViewDto, NewPublicationMediasDto } from './medias.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';

@ApiTags('Medias')
@UseGuards(JwtAuthGuard)
@Controller('medias')
export class MediasController {
  constructor(private service: MediasService) {}

  @ApiCreatedResponse({
    description: 'New medias successfully created.',
    type: Media,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/publication/new')
  async create(@Body() value: NewPublicationMediasDto) {
    return this.service.createMediasForPublication(value);
  }

  @ApiOkResponse({
    description: 'Register new view for media.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiNotFoundResponse({
    description: 'Not found resource.',
  })
  @Post('/view')
  async registerNewView(@Body() value: NewMediaViewDto) {
    return this.service.registerNewView(value);
  }
}
