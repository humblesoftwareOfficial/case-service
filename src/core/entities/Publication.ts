/* eslint-disable prettier/prettier */
import { DefaultAttributesEntity } from './DefaultAttributes';
import { MediaEntity } from './Media';
import { ProductEntity } from './Product';
import { UserEntity } from './User';

export enum EPublicationType {
  DEFAULT = 'DEFAULT',
  SALE = 'SALE',
  ADVERTISING = 'ADVERTISING',
  SALE_FROM_PRODUCT = 'SALE_FROM_PRODUCT',
  SERVICE = 'SERVICE',
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
  products: ProductEntity[];
}
