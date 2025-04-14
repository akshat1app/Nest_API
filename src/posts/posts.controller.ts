import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
// import { AuthExGuard } from 'src/auth/guards/auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user, @Body() createPostDto: CreatePostDto) {
    const post = await this.postsService.create(user.userId,createPostDto);
    return {
      message:'Post Created',
      data:post,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllPost(@CurrentUser() user) {
    const posts = await this.postsService.findAllPost(user.userId);
    return {
      message:`All Posts of the user ${user.email}`,
      data:posts,
    };
  }
}
