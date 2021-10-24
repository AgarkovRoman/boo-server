import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TASK_NOT_FOUND } from './task.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTask(@Body() dto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.createTask(dto, req);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTasksById(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.tasksService.deleteTaskById(id);

    if (!deletedDoc) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return deletedDoc;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('byUser')
  async getTasksByUserId(@Request() req: any) {
    return this.tasksService.getTasksByUserId(req);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTasksById(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTaskDto,
  ) {
    const updatedTask = await this.tasksService.updateTaskById(id, dto);

    if (!updatedTask) {
      throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedTask;
  }
}
