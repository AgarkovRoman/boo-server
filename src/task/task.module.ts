import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { TaskModel } from './task.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [TaskService],
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
    AuthModule,
  ],
  exports: [TaskService]
})
export class TaskModule {}
