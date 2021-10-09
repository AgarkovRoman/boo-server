import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskModel } from './task.model';
import { Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TaskModel)
    private readonly taskRepository: ModelType<TaskModel>,
    private readonly authService: AuthService,
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

  async getTasksByUserId(req: any): Promise<DocumentType<TaskModel>[]> {
    const userId = await this.authService.getUserIdFromJWT(req);
    return this.taskRepository.find({ userId: Types.ObjectId(userId) }).exec();
  }

  // async getTasksByProjectId(projectId: number) {
  //   return await this.taskRepository.findAll({
  //     where: { projectId },
  //     raw: true,
  //   });
  // }
}
