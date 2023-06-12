import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogBody } from '../../../dto/blogs/dto/body/blog.body';
import { BlogCreationDto } from '../../../dto/blogs/dto/blog.creation.dto';
import { OwnerInfoDto } from '../../../dto/blogs/dto/owner.info.dto';
import { BlogBanInfoDto } from '../../../dto/blogs/dto/blog.ban.info.dto';
import { BannedUserDto } from '../../../dto/blogs/dto/banned.user.dto';

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
  isUserBanned: boolean;

  @Prop()
  banInfo: BlogBanInfoDto;

  @Prop()
  bannedUsersForBlog: BannedUserDto[] | [];

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

  updateBanInfo(banStatus: boolean) {
    this.isUserBanned = banStatus;
  }

  updateBanInfoForBlog(banStatus: boolean) {
    this.banInfo.isBanned = banStatus;
    this.banInfo.banDate = new Date().toISOString();
    if (!banStatus) {
      this.banInfo.banDate = null;
    }
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
      banInfo: {
        isBanned: false,
        banDate: null,
      },
      bannedUsersForBlog: [],
      isMembership: false,
      isUserBanned: false,
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
  updateBanInfo: Blog.prototype.updateBanInfo,
  updateBanInfoForBlog: Blog.prototype.updateBanInfoForBlog,
};

export type BlogModelType = Model<BlogDocument> & BlogModelStaticType;
