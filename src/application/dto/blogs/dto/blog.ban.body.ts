import { IsBoolean } from 'class-validator';

export class BlogBanBody {
  @IsBoolean()
  isBanned: boolean;
}
