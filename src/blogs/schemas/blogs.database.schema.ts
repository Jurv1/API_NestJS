import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogBody } from '../dto/blog.body';
import { BlogCreationDto } from '../dto/blog.creation.dto';
import { OwnerInfoDto } from '../dto/owner.info.dto';

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
  ownerInfo: OwnerInfoDto;

  @Prop()
  isMembership: boolean;

  @Prop()
  createdAt: string;

  updateBlog(dto: BlogBody) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }

  bindUser(userId: string, userLogin: string) {
    this.ownerInfo.userId = userId;
    this.ownerInfo.userLogin = userLogin;
  }

  static createBlog(
    blogDto: BlogCreationDto,
    BlogModel: BlogModelType,
  ): BlogDocument {
    const createdBlog = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      ownerInfo: {
        userId: blogDto.userId,
        userLogin: blogDto.userLogin,
      },
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return new BlogModel(createdBlog);
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogModelStaticType = {
  createBlog: (
    blogDto: BlogCreationDto,
    BlogModel: BlogModelType,
  ) => BlogDocument;
};

const blogStaticMethods: BlogModelStaticType = {
  createBlog: Blog.createBlog,
};

BlogSchema.statics = blogStaticMethods;

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
  bindUser: Blog.prototype.bindUser,
};

export type BlogModelType = Model<BlogDocument> & BlogModelStaticType;
