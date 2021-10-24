import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskModel } from './task.model';
import { Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { Task } from './task.types';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TaskModel)
    private readonly taskRepository: ModelType<TaskModel>,
    private readonly authService: AuthService,
  ) {}

  // tslint:disable-next-line:no-any
  async createTask(dto: CreateTaskDto, req: any): Promise<Task> {
    const userId = await this.authService.getUserIdFromJWT(req);
    const createDto = {
      userId,
      ...dto
    };
    const task: DocumentType<TaskModel> = await this.taskRepository.create(createDto);
    const { _id, name, description, archived, date, projectId } = task;
    return {
      id: _id,
      name,
      description,
      archived,
      date,
      projectId
    };
  }

  async deleteTaskById(id: string): Promise<{success: boolean}> {
    const deletedTask: DocumentType<TaskModel> | null = await this.taskRepository.findByIdAndDelete(id).exec();
    if (deletedTask) {
      return { success: true };
    }
    return { success: false };
  }

  async updateTaskById(
    id: string,
    dto: CreateTaskDto,
  ): Promise<Task | null> {
    const updatedTask: DocumentType<TaskModel> | null = await this.taskRepository
      .findByIdAndUpdate(id, dto, { new: true, useFindAndModify: false })
      .exec();
    if (updatedTask) {
      const { _id, name, description, archived, date, projectId } = updatedTask;
      return { id: _id, name, description, archived, date, projectId };
    }
    return null;
  }

  async getTasksByUserId(req: any): Promise<Task[]> {
    const userId = await this.authService.getUserIdFromJWT(req);
    const tasks: DocumentType<TaskModel>[] = await this.taskRepository.find({ userId: Types.ObjectId(userId) }).exec();
    return tasks.map(({ _id, name, description, archived, projectId, date }) => {
      return {
        id: _id,
        name,
        description,
        archived,
        date,
        projectId
      };
    });
  }

  // async getTasksByProjectId(projectId: number) {
  //   return await this.taskRepository.findAll({
  //     where: { projectId },
  //     raw: true,
  //   });
  // }
}
