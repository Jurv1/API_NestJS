import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blogs/blogs.controller';
import { PostController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';
import { PostService } from './posts/posts.service';
import { BlogService } from './blogs/blogs.service';
import { UsersService } from './users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/schemas/blogs.database.schema';
import { Post, PostSchema } from './posts/schemas/posts.database.schema';
import { User, UserSchema } from './users/schemas/users.database.schema';
import { ConfigModule } from '@nestjs/config';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogQ } from './blogs/blogs.query.repository';
import { PostsRepository } from './posts/posts.repository';
import { PostQ } from './posts/posts.query.repository';
import { UsersRepository } from './users/users.repository';
import { UserQ } from './users/users.query.repository';
import { CommentQ } from './comments/comments.query.repository';
import {
  CommentSchema,
  DBComment,
} from './comments/schemas/comments.database.schema';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [
    AppController,
    BlogController,
    PostController,
    UsersController,
    AuthController,
  ],
  providers: [
    AppService,
    BlogService,
    PostService,
    UsersService,
    BlogsRepository,
    BlogQ,
    PostsRepository,
    PostQ,
    UsersRepository,
    UserQ,
    CommentQ,
  ],
})
export class AppModule {}
