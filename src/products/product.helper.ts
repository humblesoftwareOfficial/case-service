/* eslint-disable prettier/prettier */

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';
import { Stock } from './stock.entity';

export const isValidProductCode = (code: string) =>
  code && code.length === 23 && code.includes('PRO-');

@ValidatorConstraint({ name: 'ProductCodeValidator', async: false })
export class ProductCodeValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(code: string, _args: ValidationArguments) {
    return isValidProductCode(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Invalid  Product code.';
  }
}

export interface IProductionListFilter {
  skip: number;
  limit: number;
  week?: number;
  month?: number;
  year?: number;
  user?: Types.ObjectId;
  searchTerm?: string;
  isInPromotion?: boolean;
}

export interface IProductProvisioning {
  product: Types.ObjectId;
  newStock: Stock;
  provisionId: Types.ObjectId;
}