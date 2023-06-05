import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsBlogExist } from '../../utils/custom.validation.decorators/is.blog.exists';

export class PostUpdateBody {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, 1000)
  content: string;

  @IsBlogExist()
  blogId?: string;
}
