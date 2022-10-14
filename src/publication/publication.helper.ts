/* eslint-disable prettier/prettier */

import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Types } from 'mongoose';

import { EPublicationType } from '../core/entities/Publication';

export const isValidPublicationCode = (code: string) =>
  code && code.length === 23 && code.includes('PUB-');

@ValidatorConstraint({ name: 'PublicationCodeValidator', async: false })
export class PublicationCodeValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(code: string, _args: ValidationArguments) {
    return isValidPublicationCode(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Invalid  Publication code.';
  }
}

@ValidatorConstraint({ name: 'PublicationsCodesValidator' })
export class PublicationsCodesValidator
  implements ValidatorConstraintInterface
{
  validate(codes: string[], _args: ValidationArguments) {
    let isValid = true;
    for (const code of codes) {
      if (!isValidPublicationCode(code)) isValid = false;
    }
    return isValid;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'At least on active publication code you provided is incorrect.';
  }
}

export interface IPublicationsListFilter {
  skip: number;
  limit: number;
  type?: EPublicationType;
  week?: number;
  month?: number;
  year?: number;
  user?: Types.ObjectId;
  section?: Types.ObjectId;
  searchTerm?: string;
  fromProduct?: boolean;
  ignorePublications?: string[];
}