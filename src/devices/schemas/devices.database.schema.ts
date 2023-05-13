import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { DeviceCreateDto } from '../dto/device-create.dto';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  lastActiveDate: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  userId: string;

  static createPost(
    deviceCreateDto: DeviceCreateDto,
    deviceModel: DeviceModelType,
  ) {
    const createdDevice = {
      ip: deviceCreateDto.ip,
      title: deviceCreateDto.title,
      lastActiveDate: deviceCreateDto.lastActiveDate,
      deviceId: deviceCreateDto.deviceId,
      userId: deviceCreateDto.userId,
    };
    return new deviceModel(createdDevice);
  }
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

export type DeviceModelStaticType = {
  createDevice: (
    deviceCreateDto: DeviceCreateDto,
    deviceModel: DeviceModelType,
  ) => DeviceDocument;
};

const deviceStaticMethods: DeviceModelStaticType = {
  createDevice: Device.createPost,
};

DeviceSchema.statics = deviceStaticMethods;

export type DeviceModelType = Model<DeviceDocument> & DeviceModelStaticType;
