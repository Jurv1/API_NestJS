import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../src/blogs/schemas/blogs.database.schema';
import { Post, PostSchema } from '../src/posts/schemas/posts.database.schema';
import { User, UserSchema } from '../src/users/schemas/users.database.schema';
import {
  CommentSchema,
  DBComment,
} from '../src/comments/schemas/comments.database.schema';
import { AppController } from '../src/app.controller';
import { BlogController } from '../src/blogs/blogs.controller';
import { PostController } from '../src/posts/posts.controller';
import { UsersController } from '../src/users/users.controller';
import { AppService } from '../src/app.service';
import { BlogService } from '../src/blogs/blogs.service';
import { PostService } from '../src/posts/posts.service';
import { UsersService } from '../src/users/users.service';
import { BlogsRepository } from '../src/blogs/blogs.repository';
import { BlogQ } from '../src/blogs/blogs.query.repository';
import { PostsRepository } from '../src/posts/posts.repository';
import { PostQ } from '../src/posts/posts.query.repository';
import { UsersRepository } from '../src/users/users.repository';
import { UserQ } from '../src/users/users.query.repository';
import { CommentQ } from '../src/comments/comments.query.repository';

export const appTestingModule = {
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: DBComment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [AppController, BlogController, PostController, UsersController],
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
};
