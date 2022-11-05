/* eslint-disable prettier/prettier */

import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export const isValidReactionCode = (code: string) =>
  code && code.length === 23 && code.includes('REA-');

@ValidatorConstraint({ name: 'ReactionCodeValidator', async: false })
export class ReactionCodeValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(code: string, _args: ValidationArguments) {
    return isValidReactionCode(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Invalid  Reaction code.';
  }
}

export enum EReactionsType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  MESSAGE = 'MESSAGE',
}
