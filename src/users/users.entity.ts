/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EUserGender } from '../core/entities/User';

import { Publication } from '../publication/publication.entity';
import { DefaultAttributes } from '../shared/default-collection-attributes.entity';
import { EAccountType } from './users.helper';

export type UserDocument = User & Document;

@Schema()
export class User extends DefaultAttributes {
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String, unique: true })
  phone: string;

  @Prop({ required: true, type: String, unique: true })
  pseudo: string;

  @Prop({ type: String, default: '' })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: EUserGender, default: EUserGender.OTHER })
  gender: string;

  @Prop({ type: String, enum: EAccountType, default: EAccountType.DEFAULT })
  accountType: string;

  @Prop({ type: String, default: '' })
  address: string;

  @Prop({ type: String, default: '' })
  profile_picture: string;

  @Prop({ type: String, default: '' })
  profile_picture_key: string;

  @Prop({ type: [], default: [] })
  push_tokens: string[];

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Publication' })
  publications: Publication[];

  @Prop({ type: [Types.ObjectId], default: [], ref: 'User' })
  followers: User[];//abonnés

  @Prop({ type: [Types.ObjectId], default: [], ref: 'User' })
  subscriptions: User[]; //abonnements
}

export const UserSchema = SchemaFactory.createForClass(User);
