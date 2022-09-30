/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema({ _id: false })
export class Stock {
  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: Number })
  purchasePrice: number;

  @Prop({
    type: String,
  })
  unit: string;

  @Prop({ type: Date })
  expirationDate: Date;

  @Prop({ type: Number, default: 0 })
  threshold?: number;
}
