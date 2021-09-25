import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectModel } from './project.model';
import { Types } from 'mongoose';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(ProjectModel)
    private projectRepository: ModelType<ProjectModel>,
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
    userId: string,
  ): Promise<DocumentType<ProjectModel>[]> {
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
