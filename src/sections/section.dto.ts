/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewSectionDto {
  @IsNotEmpty({ message: 'Label of section is required ' })
  @IsString({ message: 'Label of section must be string.' })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Description of section must be string.' })
  description: string;
}
