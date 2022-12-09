/* eslint-disable prettier/prettier */
import { DefaultAttributesEntity } from './DefaultAttributes';
import { UserEntity } from './User';

class GiftEntity {
  name: string;
  giftNumber: number;
  associatedMedia: string;
}
export class ChallengeEntity extends DefaultAttributesEntity {
  label: string;
  description: string;
  isStillRunning: boolean;
  week: number;
  month: number;
  year: number;
  gifts: GiftEntity[];
  createdBy: UserEntity;
  lastUpdatedBy: UserEntity;
}
