import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class BlogBansByAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  banDate: Date;

  @OneToOne(() => Blog, (blog) => blog.blogBanByAdmin, { onDelete: 'CASCADE' })
  @JoinColumn()
  blog: Blog;
}
