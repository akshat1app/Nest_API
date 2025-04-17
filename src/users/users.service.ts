import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilePhoto, ProfilePhotoDocument } from './schemas/user_profile-photo.schema';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private readonly s3Client:S3Client;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ProfilePhoto.name) private readonly profilePhotoModel: Model<ProfilePhotoDocument>,
    private readonly configService:ConfigService,
    
  ) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserProfile(userId: string): Promise<User> {
    return this.getUserById(userId);
  }

  async updateUserProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true });
  }

  async uploadProfilePhoto(userId: string, file: Express.Multer.File) {
    const existingProfile = await this.profilePhotoModel.findOne({userId});
    if(existingProfile){
      throw new BadRequestException('Profile Photo already exist');
    }

    const key = `users/${userId}/profile/${randomUUID()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket:this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType:file.mimetype,
      }),
    );

    const fileUrl = `https://${this.configService.getOrThrow('AWS_S3_BUCKET')}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${key}`;

    const ProfilePhoto = new this.profilePhotoModel({
      originalName: file.originalname,
      filename: file.filename,  
      path: file.path,
      size: file.size,
      key:key,
      url:fileUrl,
      mimetype: file.mimetype,
      userId: userId,
    });
    
    return ProfilePhoto.save();
  }
}
