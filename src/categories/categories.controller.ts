import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { AddTagsToCategoriesDto, NewCategoriyDto } from './categories.dto';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @ApiCreatedResponse({
    description: 'Catgories created.',
    type: Category,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/new')
  async create(@Body() value: NewCategoriyDto[]) {
    return this.service.create(value);
  }

  @ApiCreatedResponse({
    description: 'Tags added to categoies.',
    type: Category,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/tags')
  async addTags(@Body() value: AddTagsToCategoriesDto[]) {
    return this.service.addTags(value);
  }
}
