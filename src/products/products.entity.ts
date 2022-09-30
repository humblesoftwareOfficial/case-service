/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/categories/categories.entity';
// import { EProductType } from 'src/core/entities/Product';
import { Media } from 'src/medias/medias.entity';
import { Publication } from 'src/publication/publication.entity';
import { Section } from 'src/sections/sections.entity';
import { User } from 'src/users/users.entity';

import { DefaultAttributes } from '../shared/default-collection-attributes.entity';
import { PriceHistory } from './price-history.entity';
import { ProductColor } from './products-colors.entity';
import { StockProvisioning } from './stock-provisioning.entity';
import { Stock } from './stock.entity';

export type ProductDocument = Product & Document;

@Schema()
export class Product extends DefaultAttributes {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: [], default: [] })
  priceHistory: PriceHistory[];

  @Prop({ type: [], default: [] })  
  colors: ProductColor[]

  @Prop({ type: Stock, required: true })
  stock: Stock;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Section', index: true })
  section: Section | Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Category', index: true })
  category: Category | Types.ObjectId;

  @Prop({ type: [String], default: [],})
  tags: string[];

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Media' })
  medias: Media[] | Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Publication' })
  publications: Publication[] | Types.ObjectId[];

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ type: Boolean, default: false })
  isInPromotion: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'StockProvisioning', default: [] })
  provisions?: StockProvisioning[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
