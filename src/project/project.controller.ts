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
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './project.service';
import { PROJECT_NOT_FOUND } from './project.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Delete('/:id')
  async deleteProjectById(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.projectsService.deleteProjectById(id);

    if (!deletedDoc) {
      throw new HttpException(PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return deletedDoc;
  }

  // TODO: сделать по токену, а не по id
  @Get('byUser/:userId')
  async getProjectsByUserId(@Param('userId', IdValidationPipe) userId: string) {
    return this.projectsService.getProjectsByUserId(userId);
  }

  @Patch(':id')
  async updateProjectById(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateProjectDto,
  ) {
    const updatedProject = await this.projectsService.updateProjectById(id, dto);

    if (!updatedProject) {
      throw new HttpException(PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedProject;
  }
}
