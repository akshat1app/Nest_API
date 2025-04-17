import { Controller, Get, Put, Body, UseGuards, Param, UploadedFile, UseInterceptors, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getUserProfile(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateUserProfile(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getUserById(@Param() params:any){
    return this.usersService.getUserById(params.id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(@CurrentUser() user: any,@UploadedFile() file:Express.Multer.File ){
    const profilePhoto = await this.usersService.uploadProfilePhoto(user.userId,file);
    return {
      message:"Profile Photo Updated",
      data:profilePhoto,
    }
  }

}