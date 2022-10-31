/* eslint-disable prettier/prettier */
import { DefaultAttributesEntity } from "./DefaultAttributes";
import { ProductEntity } from "./Product";
import { UserEntity } from "./User";

export class StockProvisioningEntity extends DefaultAttributesEntity {
  value: number;
  date: Date;
  week: number;
  month: number;
  year: number;
  product: ProductEntity;
  user: UserEntity;
  oldStockValue: number;
  newStockValue: number;
}
