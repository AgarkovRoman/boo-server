import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRoot(
      'mongodb+srv://boo-boo:f5dn5xvmRfzVhqxX@cluster0.dqwhz.mongodb.net/booboo?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
    ),
    AuthModule,
    // TopPageModule,
    // ProductModule,
    // ReviewModule,
    TaskModule,
    ProjectModule,
  ],
})
export class AppModule {}
