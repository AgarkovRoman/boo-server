import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export interface ProjectModel extends Base {}

export class ProjectModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  description?: string;

  @prop()
  userId: Types.ObjectId;
}
