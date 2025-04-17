// file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type ProfilePhotoDocument = ProfilePhoto & Document;

@Schema()
export class ProfilePhoto {

  @Prop()
  originalName: string;

  @Prop()
  filename: string;

  @Prop()
  path: string;

  @Prop()
  size: number;

  @Prop()
  mimetype: string;

  @Prop()
  key: string;

  @Prop()
  url:string;

  @Prop({type: mongoose.Schema.Types.ObjectId,ref: User.name})
  userId: mongoose.Schema.Types.ObjectId;
}

export const ProfilePhotoSchema = SchemaFactory.createForClass(ProfilePhoto);
