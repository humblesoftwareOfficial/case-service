/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';

export type GiftDocument = Gift & Document;

@Schema({ _id: false })
export class Gift {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  giftNumber: number;

  @Prop({ type: String, default: "" })
  associatedMedia: string;
}
