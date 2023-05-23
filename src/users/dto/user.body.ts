import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserBody {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 10)
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(6, 20)
  password: string;
}
