/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { NewPublicationViewDto } from './publication-view.dto';
import { PublicationViewService } from './publication-view.service';

@ApiTags('Publication View')
@UseGuards(JwtAuthGuard)
@Controller('publication-view')
export class PublicationViewController {
  constructor(private service: PublicationViewService) {}

  @ApiOkResponse({
    description: 'Register new view for publication.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiNotFoundResponse({
    description: 'Not found resource.',
  })
  @Post('/register')
  async registerNewView(@Body() value: NewPublicationViewDto) {
    return this.service.registerNewView(value);
  }
}
