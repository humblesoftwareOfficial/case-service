/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { PublicationCodeValidator } from '../publication/publication.helper';
import { UserCodeValidator } from '../users/users.helper';

export class NewPublicationViewDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: 'Publication viewed is required.' })
  @Validate(PublicationCodeValidator)
  publication: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: '' })
  @Validate(PublicationCodeValidator)
  publicationFrom: string;
}
