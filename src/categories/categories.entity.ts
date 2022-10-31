/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Publication } from 'src/publication/publication.entity';
import { Section } from 'src/sections/sections.entity';

import { DefaultAttributes } from '../shared/default-collection-attributes.entity';

export type CategoryDocument = Category & Document;

@Schema()
export class Category extends DefaultAttributes {
  @Prop({ type: String, unique: true, required: true })
  label: string;

  @Prop({ type: String })
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Section' })
  section: Section | Types.ObjectId;

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Publication' })
  publications: Publication[] | Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
