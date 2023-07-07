import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class EmailConfirmationForUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  confirmationCode: string;

  @Column()
  expirationDate: Date;

  @OneToOne(() => User, (user) => user.emailConfirmationForUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
