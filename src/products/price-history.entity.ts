/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PriceHistoryDocument = PriceHistory & Document;

@Schema({ _id: false })
export class PriceHistory {
  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ type: Boolean, default: false })
  isInPromotion: boolean;
}
