/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Publication } from '../publication/publication.entity';
import { User } from '../users/users.entity';
import { DefaultAttributes } from '../shared/default-collection-attributes.entity';
import { EReactionsType } from './reactions.helpers';

export type ReactionsDocument = Reactions & Document;


@Schema()
export class Reactions extends DefaultAttributes {
  @Prop({ type: String })
  message: string;

  @Prop({
    required: true,
    type: String,
    enum: EReactionsType,
  })
  type: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Publication', index: true })
  publication: Publication | Types.ObjectId;

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;
}

export const ReactionsSchema = SchemaFactory.createForClass(Reactions);
