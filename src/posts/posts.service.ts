import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema'
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly PostModel: Model<PostDocument>) {}


  async create(userId: any,createPostDto: CreatePostDto) {
    const newPost = new this.PostModel({
      ...createPostDto,
      userId,
    });
    return newPost.save();
  }

  async findAllPost(userId:any): Promise<Post[]> {
    return await this.PostModel.find({userId}).sort({ createdAt: -1 }).exec();
  }
  
}
