/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { PublicationCodeValidator } from '../publication/publication.helper';
import { UserCodeValidator } from '../users/users.helper';
import { EReactionsType, ReactionCodeValidator } from './reactions.helpers';

export class NewReactionDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: 'Publication viewed is required.' })
  @Validate(PublicationCodeValidator)
  publication: string;

  @IsNotEmpty({ message: 'Reaction type cannot be empty.' })
  @IsEnum(EReactionsType, {
    message: 'Reaction type must be a valid value. See EReactionsType enum!',
  })
  reactionType: EReactionsType;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsNotEmpty({ message: '' })
  @Validate(PublicationCodeValidator)
  publicationFrom: string;

  @ApiProperty({ required: false })
  @IsOptional({})
  @IsString({ message: '' })
  message: string;
}

export class RemoveReactionDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: 'Publication is required.' })
  @Validate(PublicationCodeValidator)
  publication: string;

  @IsNotEmpty({ message: 'Reaction is required.' })
  @Validate(ReactionCodeValidator)
  reaction: string;
}

export class RemoveLikeOrRecordDto {
  @IsNotEmpty({ message: 'User is required.' })
  @Validate(UserCodeValidator)
  user: string;

  @IsNotEmpty({ message: 'Publication is required.' })
  @Validate(PublicationCodeValidator)
  publication: string;

  @IsNotEmpty({ message: 'Reaction type cannot be empty.' })
  @IsEnum(EReactionsType, {
    message: 'Reaction type must be a valid value. See EReactionsType enum!',
  })
  reactionType: EReactionsType;
}
