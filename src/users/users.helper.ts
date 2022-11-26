/* eslint-disable prettier/prettier */
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { User } from 'src/users/users.entity';

export const isValidUserCode = (code: string) =>
  code && code.length === 23 && code.includes('USR-');

@ValidatorConstraint({ name: 'UserCodeValidator', async: false })
export class UserCodeValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(code: string, _args: ValidationArguments) {
    return isValidUserCode(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Invalid  user code.';
  }
}

@ValidatorConstraint({ name: 'UsersCodesValidator' })
export class UsersCodesValidator
  implements ValidatorConstraintInterface
{
  validate(codes: string[], _args: ValidationArguments) {
    let isValid = true;
    for (const code of codes) {
      if (!isValidUserCode(code)) isValid = false;
    }
    return isValid;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'At least one active user code you provided is incorrect.';
  }
}

export const getDefaultUserInfos = (user: User) => ({
  code: user?.code,
  firstName: user?.firstName,
  lastName: user?.lastName,
  isDeleted: user?.isDeleted,
  email: user?.email,
  createdAt: user?.createdAt,
  lastUpdatedDate: user?.lastUpdatedAt,
  phone: user?.phone,
  push_tokens: user.push_tokens,
  profile_picture: user?.profile_picture,
  accountType: user?.accountType
});

export interface IFindUserbyEmailOrPhone {
  email: string;
  phone: string;
}

export interface IUserTokenVerification {
  id: string;
  code: string;
}

export enum EAccountType {
  DEFAULT = 'DEFAULT',
  SELLER = 'SELLER', //COMPTE DE BOUTIQUES VENDEURS COSMETIQUES
  CREATOR = 'CREATOR', //COMPTE DE SERVICES
  SELLER_CREATOR = 'SELLER_CREATOR',// COMPTE DE BOUTIQUE COSMETIQUE ET DE SERVICES
}