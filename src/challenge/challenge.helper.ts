/* eslint-disable prettier/prettier */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

export const isValidChallengeCode = (code: string) =>
  code && code.length === 23 && code.includes('CHL-');

@ValidatorConstraint({ name: 'ChallengeCodeValidator', async: false })
export class ChallengeCodeValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(code: string, _args: ValidationArguments) {
    return isValidChallengeCode(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Invalid  Challenge code.';
  }
}

export interface IChallengeListFilter {
  skip: number;
  limit: number;
  searchTerm?: string;
  isStillRunning?: boolean;
}

export interface IChallengeRankingFilter {
  challengeId: Types.ObjectId;
  skip: number;
  limit: number;
}