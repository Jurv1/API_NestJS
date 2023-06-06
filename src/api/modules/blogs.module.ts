import { Module } from '@nestjs/common';
import { allBlogsUseCases } from './use-cases/all.blogs.use-cases';
import { allReposForBlogs } from './repositories/all.repos.for.blogs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from '../../application/schemas/blogs/schemas/blogs.database.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { SuperAdminBlogsController } from '../_super-admin/super-admin.blogs/super-admin.blogs.controller';
import { BloggerBlogController } from '../_blogger/blogs.blogger/blogs.blogger.controller';
import { PostsModule } from './posts.module';
import { BlogMapper } from '../../application/utils/mappers/blog.mapper';
import { JwtService } from '@nestjs/jwt';
import { IsBlogExists } from '../../application/utils/custom.validation.decorators/is.blog.exists';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    PostsModule,
  ],
  controllers: [SuperAdminBlogsController, BloggerBlogController],
  providers: [
    ...allBlogsUseCases,
    ...allReposForBlogs,
    JwtService,
    BlogMapper,
    IsBlogExists,
  ],
})
export class BlogsModule {}
