import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type TokenBlackListDocument = HydratedDocument<RefreshTokenBlacklist>;
@Schema()
export class RefreshTokenBlacklist {
  @Prop()
  refresh: string;
}

export const RefreshTokenBlackListSchema = SchemaFactory.createForClass(
  RefreshTokenBlacklist,
);

export type RefreshTokenBlackListModel = Model<RefreshTokenBlacklist>;
