import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Blog } from '../blogs/blog.entity';

@Entity()
export class BannedUsersByBlogger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone' })
  banDate: Date;

  @Column({ type: 'varchar' })
  banReason: string;

  @OneToOne(() => User, (user) => user.bannedForBlog, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.bannedUsersByBlogger, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: Blog;
}
