/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Publication } from '../publication/publication.entity';
import { DefaultAttributes } from '../shared/default-collection-attributes.entity';
import { User } from '../users/users.entity';

export type PublicationViewDocument = PublicationView & Document;

@Schema()
export class PublicationView extends DefaultAttributes {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Publication', index: true })
  publication: Publication | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Publication', default: null })
  publicationFrom: Publication | Types.ObjectId;

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ type: Boolean, default: false })
  isInPromotion: boolean;
}

export const PublicationViewSchema = SchemaFactory.createForClass(PublicationView);