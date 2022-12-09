/* eslint-disable prettier/prettier */
import { CategoryEntity } from './Category';
import { ChallengeEntity } from './Challenge';
import { DefaultAttributesEntity } from './DefaultAttributes';
import { MediaEntity } from './Media';
import { ProductEntity } from './Product';
import { PublicationViewEntity } from './PublicationView';
import { ReactionsEntity } from './Reactions';
import { SectionEntity } from './Section';
import { UserEntity } from './User';

export enum EPublicationType {
  DEFAULT = 'DEFAULT',
  SALE = 'SALE',
  ADVERTISING = 'ADVERTISING',
  SALE_FROM_PRODUCT = 'SALE_FROM_PRODUCT',
  SERVICE = 'SERVICE',
  CHALLENGE = "CHALLENGE"
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
  section: SectionEntity;
  category: CategoryEntity;
  tags: string[];
  views: PublicationViewEntity[];
  likes: ReactionsEntity[];
  comments: ReactionsEntity[];
  associatedChallenge: ChallengeEntity;
}
