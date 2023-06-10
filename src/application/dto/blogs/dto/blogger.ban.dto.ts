import { IsBlogExist } from '../../../utils/custom.validation.decorators/is.blog.exists';
import { IsBoolean, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class BloggerBanDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(20)
  banReason: string;

  @IsBlogExist()
  blogId: string;
}
