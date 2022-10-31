/* eslint-disable prettier/prettier */
import { DefaultAttributesEntity } from './DefaultAttributes';
import { UserEntity } from './User';

export class PublicationEntity extends DefaultAttributesEntity {
  user: UserEntity;
  publication: PublicationEntity;
  publicationFrom?: PublicationEntity;
  week: number;
  month: number;
  year: number;
  isInPromotion: boolean;
}
