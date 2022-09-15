/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Validate,
} from 'class-validator';
import { EPublicationType } from '../core/entities/Publication';
import { UserCodeValidator } from '../users/users.helper';
import { PaginationDto } from '../shared/pagination.dto';

export class NewPublicationDto {
  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: 'Label (Title) of publication is required.' })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: 'Description of publication is required.' })
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
}

export class PublicationsListDto extends PaginationDto {
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
  @IsNotEmpty({ message: 'User value cannot be empty.' })
  @Validate(UserCodeValidator)
  user: string;
}
