import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class BanBody {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(20)
  banReason: string;
}
