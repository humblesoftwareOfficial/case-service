/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserChatDocument = UserChat & Document;

@Schema()
export class UserChat {
  @Prop({ required: true, type: String, unique: true })
  code: string;

  @Prop({ required: true, type: String })
  fullName: string;

  @Prop({ required: true, type: String, unique: true })
  phone: string;

  @Prop({ required: true, type: String, unique: true })
  password: string;

  @Prop({ type: [], default: [] })
  push_tokens: string[];
}

export const UserChatSchema = SchemaFactory.createForClass(UserChat);
