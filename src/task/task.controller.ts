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

@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Post('create')
  async createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Delete(':id')
  async deleteTasksById(@Param('id') id: string) {
    // TODO: try to use try catch
    if (!isValidObjectId(id)) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const deletedDoc = await this.tasksService.deleteTaskById(id);

    if (!deletedDoc) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return deletedDoc;
  }

  @Get('byUser/:userId')
  async getTasksByUserId(@Param('userId') userId: string) {
    return this.tasksService.getTasksByUserId(userId);
  }

  @Patch(':id')
  async updateTasksById(@Param('id') id: string, @Body() dto: CreateTaskDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const updateTask = await this.tasksService.updateTaskById(id, dto);

    if (!updateTask) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updateTask;
  }

  // @ApiOperation({ summary: 'Get task by projects id' })
  // @ApiResponse({ status: 200, type: [TaskModel] })
  // @Get()
  // getTasksByProjectId(@Body() dto: GetTaskDto) {
  //   return this.tasksService.getTasksByProjectId(dto.projectId);
  // }
}
