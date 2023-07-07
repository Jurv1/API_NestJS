import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BannedUsersByBlogger } from '../users/banned.users.by.blogger.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

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

  @CreateDateColumn({ type: 'timestamp with time zone' })
  banDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createAt: Date;

  @OneToMany(() => BannedUsersByBlogger, (ban) => ban.blog)
  bannedUsersByBlogger: BannedUsersByBlogger[];

  @OneToMany(() => Post, (post) => post.blog)
  posts: Post[];

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;
}
