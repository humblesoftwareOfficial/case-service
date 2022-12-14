/* eslint-disable prettier/prettier */
import { DefaultAttributesEntity } from './DefaultAttributes';
import { PublicationEntity } from './Publication';
import { UserEntity } from './User';

export class PublicationViewEntity extends DefaultAttributesEntity {
  user: UserEntity;
  publication: PublicationEntity;
  publicationFrom?: PublicationEntity;
  week: number;
  month: number;
  year: number;
  isInPromotion: boolean;
}
