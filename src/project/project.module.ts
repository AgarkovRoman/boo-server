import { Module } from '@nestjs/common';
import { ProjectsService } from './project.service';
import { ProjectsController } from './project.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProjectModel } from './project.model';

@Module({
  controllers: [ProjectsController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ProjectModel,
        schemaOptions: {
          collection: 'Project',
        },
      },
    ]),
  ],
  providers: [ProjectsService],
})
export class ProjectModule {}
