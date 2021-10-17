import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface RefreshTokenModel extends Base {}

export class RefreshTokenModel extends TimeStamps {
  @prop()
  userId: Types.ObjectId;

  @prop({ unique: true })
  refreshToken: string;
}
