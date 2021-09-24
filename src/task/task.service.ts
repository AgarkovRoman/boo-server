import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskModel } from './task.model';
import { Types } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TaskModel)
    private readonly taskRepository: ModelType<TaskModel>,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<DocumentType<TaskModel>> {
    return this.taskRepository.create(dto);
  }

  async deleteTaskById(id: string): Promise<DocumentType<TaskModel> | null> {
    return this.taskRepository.findByIdAndDelete(id).exec();
  }

  async updateTaskById(
    id: string,
    dto: CreateTaskDto,
  ): Promise<DocumentType<TaskModel> | null> {
    return this.taskRepository
      .findByIdAndUpdate(id, dto, { new: true, useFindAndModify: false })
      .exec();
  }

  async getTasksByUserId(userId: string): Promise<DocumentType<TaskModel>[]> {
    return this.taskRepository.find({ userId: Types.ObjectId(userId) }).exec();
  }

  // async getTasksByProjectId(projectId: number) {
  //   return await this.taskRepository.findAll({
  //     where: { projectId },
  //     raw: true,
  //   });
  // }
}
