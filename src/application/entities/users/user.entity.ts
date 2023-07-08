import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BansForUserByAdmin } from './bans.for.user.by.admin.entity';
import { EmailConfirmationForUsers } from './email.confirmation.for.users.entity';
import { PasswordRecoveryForUsers } from './password.recovery.for.users.entity';
import { Device } from '../devices/device.entity';
import { BannedUsersByBlogger } from './banned.users.by.blogger.entity';
import { Post } from '../posts/post.entity';
import { Blog } from '../blogs/blog.entity';
import { Comment } from '../comments/comment.entity';
import { CommentsLike } from '../comments/comments.like.entity';
import { PostsLike } from '../posts/posts.like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  login: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  passwordSalt: string;

  @Column({ type: 'boolean' })
  isConfirmed: boolean;

  @Column({ type: 'bool' })
  isBanned: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @OneToOne(() => BansForUserByAdmin, (bans) => bans.user)
  bansForUserByAdmin;

  @OneToOne(
    () => EmailConfirmationForUsers,
    (confirmation) => confirmation.user,
  )
  emailConfirmationForUsers: EmailConfirmationForUsers;

  @OneToOne(() => PasswordRecoveryForUsers, (pass) => pass.user)
  passwordRecoveryForUsers: PasswordRecoveryForUsers;

  @OneToOne(() => BannedUsersByBlogger, (ban) => ban.user)
  bannedForBlog: BannedUsersByBlogger;

  @OneToMany(() => Device, (device) => device.user)
  device: Device[];

  @OneToMany(() => Blog, (blog) => blog.owner)
  blogs: Blog[];

  @OneToMany(() => Post, (post) => post.owner)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => CommentsLike, (commentLike) => commentLike.user)
  commentsLikes: CommentsLike[];

  @OneToMany(() => PostsLike, (postLike) => postLike.user)
  postsLikes: PostsLike[];
}
