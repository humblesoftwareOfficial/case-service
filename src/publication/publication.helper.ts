/* eslint-disable prettier/prettier */
import { EPublicationType } from '../core/entities/Publication';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

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

export interface IPublicationsListFilter {
  skip: number;
  limit: number;
  type: EPublicationType;
  week?: number;
  month?: number;
  year?: number;
  user?: Types.ObjectId;
  searchTerm?: string;
}