/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import { EPublicationType } from '../core/entities/Publication';
import { UserCodeValidator } from '../users/users.helper';

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
