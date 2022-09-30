/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DefaultAttributes } from 'src/shared/default-collection-attributes.entity';
import { User } from 'src/users/users.entity';
import { Product } from './products.entity';


export type StockProvisioningDocument = StockProvisioning & Document;

@Schema()
export class StockProvisioning extends DefaultAttributes {
  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Product | Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User | Types.ObjectId;

  @Prop({ required: true, type: Number })
  oldStockValue: number;

  @Prop({ required: true, type: Number })
  newStockValue: number;
}

export const StockProvisioningSchema =
  SchemaFactory.createForClass(StockProvisioning);
