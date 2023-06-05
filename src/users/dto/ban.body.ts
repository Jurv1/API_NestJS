import { IsBoolean, IsNotEmpty, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class BanBody {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Min(20)
  banReason: string;
}
