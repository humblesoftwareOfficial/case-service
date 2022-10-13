/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { ProductCodeValidator } from 'src/products/product.helper';

import { EPublicationType } from '../core/entities/Publication';
import { PaginationDto } from '../shared/pagination.dto';
import { UserCodeValidator } from '../users/users.helper';
import { PublicationCodeValidator } from './publication.helper';

export class NewPublicationDto {
  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Label (Title) of publication must be string.' })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Description of publication must be string.' })
  description: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'Publication type is required.' })
  @IsEnum(EPublicationType, {
    message: 'Publication type must be a valid value',
  })
  type: EPublicationType;

  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  // @ApiProperty({ required: false })
  // @IsOptional({})
  // @IsString({ message: 'Token.' })
  // token?: string;
}

export class PublicationsListDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: 'Publication type is required.' })
  @IsEnum(EPublicationType, {
    message: 'Publication type must be a valid value',
  })
  type: EPublicationType;

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
  @IsNotEmpty({ message: 'User value cannot be empty.' })
  @Validate(UserCodeValidator)
  user: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsBoolean()
  fromProduct: boolean;
}

export class UpdatePublicationDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Label (Title) of publication must be string.' })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Description of publication must be string.' })
  description: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: 'Publication type is required.' })
  @IsEnum(EPublicationType, {
    message: 'Publication type must be a valid value',
  })
  type: EPublicationType;
}

export class NewPublicationFromProductDto extends NewPublicationDto {
  @IsNotEmpty({ message: 'Product is required.' })
  @Validate(ProductCodeValidator)
  product: string;
}
