import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { NewSectionDto } from './section.dto';
import { Section } from './sections.entity';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
// @UseGuards(JwtAuthGuard)
@Controller('sections')
export class SectionsController {
  constructor(private service: SectionsService) {}

  @ApiOkResponse({
    description: 'List of sections.',
    type: Section,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/list')
  async list() {
    return this.service.getSections();
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Sections(s) created.',
    type: Section,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/new')
  async create(@Body() value: NewSectionDto[]) {
    return this.service.create(value);
  }
}
