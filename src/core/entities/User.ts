/* eslint-disable prettier/prettier */
import { EAccountType } from '../../users/users.helper';
import { DefaultAttributesEntity } from './DefaultAttributes';
import { PublicationEntity } from './Publication';

export enum EUserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
export class UserEntity extends DefaultAttributesEntity {
  firstName: string;
  lastName: string;
  phone: string;
  pseudo: string;
  email: string;
  password: string;
  gender: EUserGender = EUserGender.OTHER;
  accountType: EAccountType;
  address: string;
  profile_picture: string;
  push_tokens: string[];
  publications: PublicationEntity[];
  followers: UserEntity[];
  subscriptions: UserEntity[];
}
