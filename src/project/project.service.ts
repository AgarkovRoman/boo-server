import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectModel } from './project.model';
import { Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { Project } from './project.types';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(ProjectModel)
    private projectRepository: ModelType<ProjectModel>,
    private readonly authService: AuthService,
  ) {}

  async createProject(
    dto: CreateProjectDto,
    req: any,
  ): Promise<Project> {
    const userId = await this.authService.getUserIdFromJWT(req);
    const createDto = {
      userId,
      ...dto
    };
    const project: DocumentType<ProjectModel> = await this.projectRepository.create(createDto);
    const { _id, name, description } = project;
    return {
      id: _id,
      name,
      description,
    };
  }

  async deleteProjectById(
    id: string,
  ): Promise<{success: boolean}> {
    const deletedProject: DocumentType<ProjectModel> | null = await this.projectRepository.findByIdAndDelete(id).exec();
    if (deletedProject) {
      return { success: true };
    }
    return { success: false };
  }

  async getProjectsByUserId(
    req: any,
  ): Promise<Project[]> {
    const userId = await this.authService.getUserIdFromJWT(req);
    const projects: DocumentType<ProjectModel>[] = await this.projectRepository
      .find({ userId: Types.ObjectId(userId) })
      .exec();
    return projects.map(({ _id, name, description }) => {
      return {
        id: _id,
        name,
        description,
      };
    });
  }

  async updateProjectById(
    id: string,
    dto: CreateProjectDto,
  ): Promise<DocumentType<ProjectModel> | null> {
    return this.projectRepository
      .findByIdAndUpdate(id, dto, { new: true, useFindAndModify: false })
      .exec();
  }
}
