import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { TaskModel } from './task.model';

@Module({
  controllers: [TaskController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TaskModel,
        schemaOptions: {
          collection: 'Task',
        },
      },
    ]),
  ],
  providers: [TaskService],
})
export class TaskModule {}
