import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlogBody {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, 15)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, 500)
  description: string;

  @IsNotEmpty()
  @IsUrl()
  @Transform(({ value }) => value?.trim())
  @Length(1, 100)
  websiteUrl: string;
}
