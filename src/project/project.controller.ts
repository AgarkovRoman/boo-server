import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './project.service';
import { PROJECT_NOT_FOUND } from './project.constants';
import { isValidObjectId } from 'mongoose';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Delete('/:id')
  async deleteProjectById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException(PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const deletedDoc = await this.projectsService.deleteProjectById(id);

    if (!deletedDoc) {
      throw new HttpException(PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return deletedDoc;
  }

  // TODO: сделать по токену, а не по id
  @Get('byUser/:userId')
  async getProjectsByUserId(@Param('userId') userId: string) {
    return this.projectsService.getProjectsByUserId(userId);
  }

  // updateProject() {}
}
