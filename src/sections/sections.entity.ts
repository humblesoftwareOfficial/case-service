/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../categories/categories.entity';
import { Publication } from '../publication/publication.entity';

import { DefaultAttributes } from '../shared/default-collection-attributes.entity';

export type SectionDocument = Section & Document;

@Schema()
export class Section extends DefaultAttributes {
  @Prop({ type: String, unique: true, required: true })
  label: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Category' })
  categories: Category[] | Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Publication' })
  publications: Publication[] | Types.ObjectId[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
