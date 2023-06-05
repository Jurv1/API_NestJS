import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExtendedLike } from './likes.schemas/extended.likes.schema';
import { HydratedDocument, Model } from 'mongoose';
import { PostBodyBlogId } from '../dto/post.body.blogId';
import { BlogDocument } from '../../blogs/schemas/blogs.database.schema';
import { postUpdateBody } from '../dto/post.update.body';
import { OwnerInfoDto } from '../../blogs/dto/owner.info.dto';
import { PostCreationDto } from '../dto/post.creation.dto';

//todo mapping for extended likes info
export type PostDocument = HydratedDocument<Post>;
@Schema()
export class Post {
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  blogId: string;
  @Prop()
  blogName: string;
  @Prop()
  ownerInfo: OwnerInfoDto;
  @Prop()
  extendedLikesInfo: ExtendedLike;
  @Prop()
  createdAt: string;

  updatePost(updatePostDto: postUpdateBody) {
    this.title = updatePostDto.title;
    this.shortDescription = updatePostDto.shortDescription;
    this.content = updatePostDto.content;
    this.blogId = updatePostDto.blogId;
  }

  static createPostWithBlogId(
    postDto: PostCreationDto,
    foundedBlog: BlogDocument,
    postModel: PostModelType,
  ): PostDocument {
    const createdPost = {
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: postDto.blogId,
      blogName: foundedBlog.name,
      ownerInfo: {
        userId: postDto.ownerInfo.userId,
        userLogin: postDto.ownerInfo.userLogin,
      },
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
      createdAt: new Date().toISOString(),
    };
    return new postModel(createdPost);
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostModelStaticType = {
  createPostWithBlogId: (
    postDto: PostCreationDto,
    foundedBlog: BlogDocument,
    PostModel: PostModelType,
  ) => PostDocument;
};

const postStaticMethods: PostModelStaticType = {
  createPostWithBlogId: Post.createPostWithBlogId,
};

PostSchema.statics = postStaticMethods;

PostSchema.methods = {
  updatePost: Post.prototype.updatePost,
};

export type PostModelType = Model<PostDocument> & PostModelStaticType;
