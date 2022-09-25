/* eslint-disable prettier/prettier */

import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export const isValidCategoryCode = (code: string) =>
  code && code.length === 23 && code.includes('CAT-');

@ValidatorConstraint({ name: 'CategoryCodeValidator', async: false })
export class CategoryCodeValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(code: string, _args: ValidationArguments) {
    return isValidCategoryCode(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Invalid Catgeory code.';
  }
}