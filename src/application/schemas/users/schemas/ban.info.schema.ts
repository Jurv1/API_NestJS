import { Prop } from '@nestjs/mongoose';

export class BanInfo {
  @Prop()
  isBanned: boolean;
  @Prop()
  banDate: string | null;
  @Prop()
  banReason: string | null;
}
