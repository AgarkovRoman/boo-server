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
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './project.service';
import { PROJECT_NOT_FOUND } from './project.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async createProject(@Body() dto: CreateProjectDto, @Request() req: any) {
    return this.projectsService.createProject(dto, req);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteProjectById(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.projectsService.deleteProjectById(id);

    if (!deletedDoc) {
      throw new HttpException(PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return deletedDoc;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('byUser')
  async getProjectsByUserId(@Request() req: any) {
    return this.projectsService.getProjectsByUserId(req);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProjectById(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateProjectDto,
  ) {
    const updatedProject = await this.projectsService.updateProjectById(
      id,
      dto,
    );

    if (!updatedProject) {
      throw new HttpException(PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedProject;
  }
}
