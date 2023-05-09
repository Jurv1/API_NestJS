import { IsString, Length } from 'class-validator';

export class PostBody {
  @IsString()
  @Length(1, 30)
  title: string;

  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Length(1, 1000)
  content: string;

  blogId?: string;
}
