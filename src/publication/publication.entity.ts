/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EPublicationType } from 'src/core/entities/Publication';
import { Media } from 'src/medias/medias.entity';
import { Product } from 'src/products/products.entity';
import { User } from 'src/users/users.entity';

import { DefaultAttributes } from '../shared/default-collection-attributes.entity';

export type PublicationDocument = Publication & Document;


@Schema()
export class Publication extends DefaultAttributes {
  @Prop({ type: String })
  label: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  price: number;

  @Prop({
    required: true,
    type: String,
    enum: EPublicationType,
    default: EPublicationType.DEFAULT,
  })
  type: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  user: User | Types.ObjectId;

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Media' })
  medias: Media[] | Types.ObjectId[];

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: []})
  products: Product[] | Types.ObjectId[];
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
