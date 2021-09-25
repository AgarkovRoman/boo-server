import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TASK_NOT_FOUND } from './task.constants';
import { isValidObjectId } from 'mongoose';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Post('create')
  async createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Delete(':id')
  async deleteTasksById(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.tasksService.deleteTaskById(id);

    if (!deletedDoc) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return deletedDoc;
  }

  @Get('byUser/:userId')
  async getTasksByUserId(@Param('userId', IdValidationPipe) userId: string) {
    return this.tasksService.getTasksByUserId(userId);
  }

  @Patch(':id')
  async updateTasksById(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTaskDto) {
    const updatedTask = await this.tasksService.updateTaskById(id, dto);

    if (!updatedTask) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedTask;
  }
}
