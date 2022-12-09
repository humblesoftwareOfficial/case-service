/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/users.entity';

import { DefaultAttributes } from '../shared/default-collection-attributes.entity';
import { Gift } from './gift.entity';

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge extends DefaultAttributes {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Boolean })
  isStillRunning: boolean;

  @Prop({ required: true, type: Number })
  week: number;

  @Prop({ required: true, type: Number })
  month: number;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ type: [], default: [] })
  gifts: Gift[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  createdBy: User | Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  lastUpdatedBy: User | Types.ObjectId;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
