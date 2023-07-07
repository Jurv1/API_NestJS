import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class BansForUserByAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  banDate: Date | null;

  @Column({ type: 'bool' })
  isBanned: boolean;

  @Column({ type: 'varchar', nullable: true })
  banReason: string | null;

  @OneToOne(() => User, (user) => user.bansForUserByAdmin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
