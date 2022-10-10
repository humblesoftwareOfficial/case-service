/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CategoryCodeValidator } from 'src/categories/categories.helper';
import { NewMediaDto } from 'src/medias/medias.dto';
import { NotEmptyArrayValidator } from 'src/shared/array.helper';
import { IsValidDate } from 'src/shared/date.helpers';
import { PaginationDto } from 'src/shared/pagination.dto';
import { URLValidator } from 'src/shared/url.helper';
import { UserCodeValidator } from 'src/users/users.helper';
import { ProductCodeValidator } from './product.helper';
import { NewStockDto } from './stock.dto';

export class ProductColorDto extends NewMediaDto {
  @IsNotEmpty({ message: 'Value of color media is required.' })
  @IsString({ message: 'Color value must be string' })
  value: string;
}

export class NewProductDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: "Product's name is required." })
  @IsString({ message: "Product's name must be string" })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: "Product's description must be string" })
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: "Decise must be string" })
  devise: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  isInPromotion: boolean;

  @IsNotEmpty({ message: 'Category is required.' })
  @Validate(CategoryCodeValidator)
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({
    message: 'Tags to add to product must be array of tags',
  })
  @IsString({ each: true })
  tags: string[];

  @IsNotEmptyObject({ nullable: false }, { message: 'Stock value is required' })
  @ValidateNested()
  @Type(() => NewStockDto)
  stock: NewStockDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({
    message: 'Product colors cannot be empty',
  })
  @Validate(NotEmptyArrayValidator)
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  colors: ProductColorDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({
    message: 'Product medias cannot be empty',
  })
  @Validate(NotEmptyArrayValidator)
  @ValidateNested({ each: true })
  @Type(() => NewMediaDto)
  medias: NewMediaDto[];
}

export class ProductsListDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: 'User value cannot be empty.' })
  @Validate(UserCodeValidator)
  user: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  week: number;

  @ApiProperty({ required: false })
  @IsOptional({})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  month: number;

  @ApiProperty({ required: false })
  @IsOptional({})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  year: number;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString()
  searchTerm: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsBoolean()
  isInPromotion?: boolean;
}

export class ProductStockProvisioningDto {
  @Type(() => Number)
  @IsNumber()
  // @Min(1)
  value: number;

  @IsNotEmpty({ message: 'Date value is required.' })
  @Validate(IsValidDate)
  date: string;

  @IsNotEmpty({ message: 'User performing action is required.' })
  @Validate(UserCodeValidator)
  author: string;

  @IsNotEmpty({ message: 'product which is provisiong is required.' })
  @Validate(ProductCodeValidator)
  product: string;
}