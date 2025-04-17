import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { User } from "src/users/schemas/user.schema";

export type PostDocument = Post & Document;

@Schema({timestamps:true})
export class Post{
    @Prop({required:true})
    title:string;

    @Prop({required:true})
    content:string

    @Prop({type: mongoose.Schema.Types.ObjectId,ref: User.name})
    userId: mongoose.Schema.Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);   