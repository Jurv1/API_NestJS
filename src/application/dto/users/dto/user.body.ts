import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsEmailExists } from '../../../utils/custom.validation.decorators/is.email.exists';
import { IsLoginExists } from '../../../utils/custom.validation.decorators/is.login.exists';

export class UserBody {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(3, 10)
  @IsLoginExists()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  @IsEmailExists()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(6, 20)
  password: string;
}
