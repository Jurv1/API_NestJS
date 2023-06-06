import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class PasswordRecovery {
  @Prop()
  recoveryCode: string | null;
  @Prop()
  expirationDate: Date | null;
}
