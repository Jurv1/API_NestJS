import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';

@Entity()
export class CommentsLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  likeStatus: string;

  @Column({ type: 'bool' })
  userStatus: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  addedAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.like, { onDelete: 'CASCADE' })
  @JoinColumn()
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentsLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
