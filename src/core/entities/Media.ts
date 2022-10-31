/* eslint-disable prettier/prettier */

import { DefaultAttributesEntity } from './DefaultAttributes';
import { PublicationEntity } from './Publication';

export enum EMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export class MediaEntity extends DefaultAttributesEntity {
  url: string;
  description: string;
  price: number;
  type: EMediaType;
  onModel: string;
  entity: PublicationEntity;
  week: number;
  month: number;
  year: number;
}
