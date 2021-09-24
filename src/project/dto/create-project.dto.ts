import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  readonly description?: string;

  @IsString({ message: 'Must be a string' })
  readonly userId: string;
}
