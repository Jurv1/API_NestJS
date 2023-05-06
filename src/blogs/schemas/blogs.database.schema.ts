import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogBody } from '../dto/blog.body';

export type BlogDocument = HydratedDocument<Blog>;
@Schema()
export class Blog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop()
  isMembership: boolean;

  @Prop()
  createdAt: string;

  updateBlog(dto: BlogBody) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }

  static createBlog(blogDto: BlogBody, BlogModel: BlogModelType): BlogDocument {
    const createdBlog = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return new BlogModel(createdBlog);
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogModelStaticType = {
  createBlog: (blogDto: BlogBody, BlogModel: BlogModelType) => BlogDocument;
};

const blogStaticMethods: BlogModelStaticType = {
  createBlog: Blog.createBlog,
};

BlogSchema.statics = blogStaticMethods;

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
};

export type BlogModelType = Model<BlogDocument> & BlogModelStaticType;
