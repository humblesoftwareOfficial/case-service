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

@ValidatorConstraint({ name: 'CategoriesCodesValidator' })
export class CategoriesCodesValidator
  implements ValidatorConstraintInterface
{
  validate(codes: string[], _args: ValidationArguments) {
    let isValid = true;
    for (const code of codes) {
      if (!isValidCategoryCode(code)) isValid = false;
    }
    return isValid;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'At least on active category code you provided is incorrect.';
  }
}