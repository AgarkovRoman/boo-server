import { Module } from '@nestjs/common';
import { ProjectsService } from './project.service';
import { ProjectsController } from './project.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProjectModel } from './project.model';
import { AuthModule } from '../auth/auth.module';

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
    AuthModule,
  ],
  providers: [ProjectsService],
})
export class ProjectModule {}
