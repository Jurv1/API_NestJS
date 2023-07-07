import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PasswordRecoveryForUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  recoveryCode: string;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: Date;

  @OneToOne(() => User, (user) => user.passwordRecoveryForUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
