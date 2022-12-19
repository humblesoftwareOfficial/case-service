/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/shared/pagination.dto';
import { UserCodeValidator } from 'src/users/users.helper';
import { ChallengeCodeValidator } from './challenge.helper';

/* eslint-disable prettier/prettier */

export class GiftDto {
  @IsNotEmpty({ message: 'Name of gift is required ' })
  @IsString({ message: 'Name of gift must be string.' })
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  giftNumber: number;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Associated Media of gift must be string.' })
  associatedMedia: string;
}

export class NewChallengeDto {
  @IsNotEmpty({ message: 'Label of challenge is required ' })
  @IsString({ message: 'Label of challenge must be string.' })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Description of challenge must be string.' })
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GiftDto)
  gifts: GiftDto[];

  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;
}

export class UpdateChallengeDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: 'Label of challenge cannot be empty ' })
  @IsString({ message: 'Label of challenge must be string.' })
  label: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: 'Description of challenge must be string.' })
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GiftDto)
  gifts: GiftDto[];

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsBoolean({ message: '' })
  isStillRunning: boolean;
}

export class GetChallengeListDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString()
  searchTerm: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsBoolean()
  isStillRunning: boolean;
}

export class GetChallengeRankingDto extends PaginationDto {
  @IsNotEmpty({ message: 'Challenge code is required!' })
  @Validate(ChallengeCodeValidator)
  challenge: string;
}