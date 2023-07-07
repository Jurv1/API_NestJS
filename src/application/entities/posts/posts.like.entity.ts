import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from './post.entity';

@Entity()
export class PostsLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  likeStatus: string;

  @Column({ type: 'bool' })
  userStatus: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  addedAt: Date;

  @ManyToOne(() => Post, (post) => post.postsLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (user) => user.postsLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
