import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicationService } from './publication.service';
import { Publication } from './publication.entity';
import { NewPublicationDto } from './publication.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';

@ApiTags('Publications')
@UseGuards(JwtAuthGuard)
@Controller('publication')
export class PublicationController {
  constructor(private service: PublicationService) {}

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
}
