import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectModel } from './project.model';
import { Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(ProjectModel)
    private projectRepository: ModelType<ProjectModel>,
    private readonly authService: AuthService,
  ) {}

  async createProject(
    dto: CreateProjectDto,
  ): Promise<DocumentType<ProjectModel>> {
    return this.projectRepository.create(dto);
  }

  async deleteProjectById(
    id: string,
  ): Promise<DocumentType<ProjectModel> | null> {
    return this.projectRepository.findByIdAndDelete(id).exec();
  }

  async getProjectsByUserId(
    req: any,
  ): Promise<DocumentType<ProjectModel>[]> {
    const userId = await this.authService.getUserIdFromJWT(req);
    return this.projectRepository
      .find({ userId: Types.ObjectId(userId) })
      .exec();
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
