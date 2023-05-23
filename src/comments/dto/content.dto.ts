import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class ContentDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(20, 300)
  content: string;
}
