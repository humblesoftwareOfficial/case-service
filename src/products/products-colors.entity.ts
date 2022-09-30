/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Media } from 'src/medias/medias.entity';

export type ProductColorDocument = ProductColor & Document;

@Schema({ _id: false })
export class ProductColor {
  @Prop({ type: String, default: "" })
  value: string;

  @Prop({ type: Types.ObjectId, default: [], ref: 'Media' })
  media: Media | Types.ObjectId;
}
