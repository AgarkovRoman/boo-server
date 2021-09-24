import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export interface TaskModel extends Base {}

export class TaskModel extends TimeStamps {
  @prop({ default: false })
  archived: boolean;

  @prop()
  name: string;

  @prop()
  date: string;

  @prop()
  description?: string;

  @prop()
  userId: Types.ObjectId;

  // @ForeignKey(() => Project)
  // @prop()
  // projectId: number;

  // @BelongsTo(() => UsersModel)
  // @prop({ ref: () => UsersModel })
  // author: Ref<UsersModel>;

  // @BelongsTo(() => Project)
  // @prop()
  // project: Project;
}
