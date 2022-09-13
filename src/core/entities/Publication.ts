/* eslint-disable prettier/prettier */
import { DefaultAttributesEntity } from './DefaultAttributes';
import { MediaEntity } from './Media';
import { UserEntity } from './User';

export enum EPublicationType {
  DEFAULT = 'DEFAULT',
  SALE = 'SALE',
  ADVERTISING = 'ADVERTISING',
  COMPETITION = 'COMPETITION',
}
export class PublicationEntity extends DefaultAttributesEntity {
  label: string;
  description: string;
  price: number;
  type: EPublicationType = EPublicationType.DEFAULT;
  user: UserEntity;
  medias: MediaEntity[];
  week: number;
  month: number;
  year: number;
}
