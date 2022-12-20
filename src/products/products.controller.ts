/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.gard';
import { InvalidCodeException } from '../exceptions/invalicode.exception.filter';
import {
  NewProductDto,
  ProductsListDto,
  ProductStockProvisioningDto,
  UpdateProductDto,
} from './product.dto';
import { isValidProductCode } from './product.helper';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

@ApiTags('Products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @ApiOkResponse({
    description: 'List of products.',
    type: Product,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/list')
  async list(@Body() value: ProductsListDto) {
    return this.service.list(value);
  }

  @ApiCreatedResponse({
    description: 'New product successfully created.',
    type: Product,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/new')
  async create(@Body() value: NewProductDto) {
    return this.service.create(value);
  }

  @ApiOkResponse({
    description: '',
    type: Product,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid publication code.',
  })
  @ApiNotFoundResponse({
    description: 'Product not found.',
  })
  @Get(':code')
  async findOne(@Param('code') code: string) {
    if (!isValidProductCode(code)) {
      throw new InvalidCodeException('Product code is incorrect!');
    }
    return this.service.findOne(code);
  }

  @ApiCreatedResponse({
    description: 'Product successfully approvioned.',
    type: Product,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/provisioning')
  async provisioning(@Body() value: ProductStockProvisioningDto) {
    return this.service.provisioning(value);
  }

  @ApiCreatedResponse({
    description: 'Product successfully updated.',
    type: Product,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Patch(':code')
  async update(@Param('code') code: string, @Body() value: UpdateProductDto) {
    if (!isValidProductCode(code)) {
      throw new InvalidCodeException('Product code is incorrect!');
    }
    return this.service.update(code, value);
  }
}
