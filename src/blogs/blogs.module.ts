import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blogs.database.schema';
import { BlogController } from './blogs.controller';
import { BlogService } from './blogs.service';
import { BlogQ } from './blogs.query.repository';
import { BlogsRepository } from './blogs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogQ, BlogsRepository],
  exports: [BlogService, BlogQ, BlogsRepository],
})
export class BlogsModule {}
