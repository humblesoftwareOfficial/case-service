/* eslint-disable prettier/prettier */
import { EReactionsType } from 'src/reactions/reactions.helpers';
import { DefaultAttributesEntity } from './DefaultAttributes';
import { PublicationEntity } from './Publication';
import { UserEntity } from './User';

export class ReactionsEntity extends DefaultAttributesEntity {
  message: string;
  type: EReactionsType;
  user: UserEntity;
  publication: PublicationEntity;
  week: number;
  month: number;
  year: number;
}
