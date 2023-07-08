import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BannedUsersByBlogger } from '../users/banned.users.by.blogger.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { BlogBansByAdmin } from './blog.bans.by.admin.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  websiteUrl: string;

  @Column({ type: 'bool', default: false })
  isMembership: boolean;

  @Column({ type: 'bool' })
  isBanned: boolean;

  @Column({ type: 'bool' })
  ownerStatus: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  banDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @OneToOne(() => BlogBansByAdmin, (ban) => ban.blog)
  blogBanByAdmin: BlogBansByAdmin;

  @OneToMany(() => BannedUsersByBlogger, (ban) => ban.blog)
  bannedUsersByBlogger: BannedUsersByBlogger[];

  @OneToMany(() => Post, (post) => post.blog)
  posts: Post[];

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToOne(() => User, (user) => user.login, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerLogin', referencedColumnName: 'login' })
  ownerLogin: string;
}
