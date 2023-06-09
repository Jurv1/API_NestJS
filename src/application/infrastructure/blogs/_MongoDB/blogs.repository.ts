import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogModelType,
} from '../../../schemas/blogs/schemas/blogs.database.schema';
import { BlogBody } from '../../../dto/blogs/dto/body/blog.body';
import { BlogCreationDto } from '../../../dto/blogs/dto/blog.creation.dto';
import { BannedUserDto } from '../../../dto/blogs/dto/banned.user.dto';
import { BlogViewDto } from '../../../dto/blogs/dto/view/blog.view.dto';

@Injectable()
export class _MongoBlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: BlogModelType,
  ) {}
  async createOne(blogDto: BlogCreationDto): Promise<BlogViewDto | null> {
    const createdBlog: BlogDocument = await this.blogModel.createBlog(
      blogDto,
      this.blogModel,
    );
    await createdBlog.save();
    return {
      id: createdBlog._id.toString(),
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: createdBlog.createdAt,
      isMembership: createdBlog.isMembership,
    };
  }

  async updateOne(blog: BlogDocument, blogBody: BlogBody): Promise<boolean> {
    await blog.updateBlog(blogBody);
    await blog.save();
    return true;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async updateBanStatusForBlogsByOwnerId(userId: string, banStatus: boolean) {
    return this.blogModel.updateMany(
      { 'ownerInfo.userId': userId },
      { $set: { isUserBanned: banStatus } },
    );
  }

  async banUserInBlog(blogId: string, bannedUser: BannedUserDto) {
    const result = await this.blogModel.updateOne(
      { _id: blogId },
      { $push: { bannedUsersForBlog: bannedUser } },
    );

    return result;
  }

  async unbanUserInBlog(blogId: string, userId: string) {
    await this.blogModel.updateOne(
      { _id: blogId },
      { $pull: { bannedUsersForBlog: { id: userId } } },
    );
  }
}
