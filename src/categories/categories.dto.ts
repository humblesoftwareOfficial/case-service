/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, Validate, ValidateNested } from 'class-validator';
import { SectionCodeValidator } from '../sections/section.helper';
import { CategoryCodeValidator } from './categories.helper';

export class NewCategoriyDto {
  @IsNotEmpty({ message: 'Label of category is required ' })
  @IsString({ message: 'Label of category must be string.' })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Description of category must be string.' })
  description: string;

  @IsNotEmpty({ message: 'Label of category is required ' })
  @Validate(SectionCodeValidator)
  section: string;
}

export class AddTagsToCategoriesDto {
  @IsNotEmpty({ message: 'Category is required ' })
  @Validate(CategoryCodeValidator)
  category: string;

  @IsArray({
    message: 'Tags must be a valid array of string',
  })
  @IsString({ each: true })
  tags: string[];
}

// export class AddTagsToCategoriesDto {
//   @IsArray({
//     message: 'Tags must be a valid array of string',
//   })
//   @ValidateNested({ each: true })
//   @Type(() => AddTagsToCategoryItemDto)
//   tags: AddTagsToCategoryItemDto[];
// }
