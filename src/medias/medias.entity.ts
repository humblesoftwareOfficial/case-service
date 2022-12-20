/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EMediaType } from '../core/entities/Media';
import { User } from '../users/users.entity';

import { DefaultAttributes } from '../shared/default-collection-attributes.entity';

export type MediaDocument = Media & Document;



@Schema()
export class Media extends DefaultAttributes {
  @Prop({ required: true, type: String })
  url: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  price: number;

  @Prop({
    required: true,
    type: String,
    enum: EMediaType,
  })
  type: string;

  @Prop({ required: true, type: String })
  onModel: string;

  @Prop({ required: true, type: Types.ObjectId, refPath: 'onModel' })
  entity: Types.ObjectId;

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
