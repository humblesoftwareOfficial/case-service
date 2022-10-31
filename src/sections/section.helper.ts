/* eslint-disable prettier/prettier */

import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export const isValidSectionCode = (code: string) =>
  code && code.length === 23 && code.includes('SEC-');

@ValidatorConstraint({ name: 'SectionCodeValidator', async: false })
export class SectionCodeValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(code: string, _args: ValidationArguments) {
    return isValidSectionCode(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Invalid  Section code.';
  }
}