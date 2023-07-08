import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { CommentsLike } from './comments.like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300 })
  content: string;

  @Column({ type: 'bool' })
  userStatus: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @OneToMany(() => CommentsLike, (like) => like.comment)
  like: CommentsLike[];

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentatorId' })
  user: User;

  @ManyToOne(() => User, (user) => user.login, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentatorLogin', referencedColumnName: 'login' })
  commentatorLogin: string;

  @ManyToOne(() => Post, (post) => post.comment, { onDelete: 'CASCADE' })
  post: Post;
}
