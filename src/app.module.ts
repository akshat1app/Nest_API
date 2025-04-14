import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { configuration } from './config/configuration';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '/home/user/NodeJs /nest-api/bin/env.local',
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => {
        return {uri: configService.get<string>("MONGO_URI")}
      }
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
