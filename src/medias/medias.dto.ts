/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { PublicationCodeValidator } from '../publication/publication.helper';
import { NotEmptyArrayValidator } from '../shared/array.helper';
import { Type } from 'class-transformer';
import { EMediaType } from '../core/entities/Media';
import { URLValidator } from '../shared/url.helper';
import { UserCodeValidator } from 'src/users/users.helper';
import { MediaCodeValidator } from './medias.helpers';

export class NewMediaDto {
  @IsNotEmpty({ message: 'URL of media is required.' })
  @Validate(URLValidator)
  url: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  description: string;

  @IsNotEmpty({ message: 'Media type is required.' })
  @IsEnum(EMediaType, {
    message: 'Media type must be a valid value',
  })
  type: EMediaType;

  @ApiProperty({ required: false })
  @IsOptional({})
  @Type(() => Number)
  @IsNumber()
  price: number;
}

export class NewPublicationMediasDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(PublicationCodeValidator)
  publication: string;

  @Validate(NotEmptyArrayValidator)
  @ValidateNested({ each: true })
  @Type(() => NewMediaDto)
  medias: NewMediaDto[];
}

export class NewMediaViewDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: 'Media viewed is required.' })
  @Validate(MediaCodeValidator)
  media: string;
}