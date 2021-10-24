import { IsBoolean, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  readonly description: string;

  @IsBoolean({ message: 'Must be a boolean' })
  readonly archived: boolean;

  @IsString({ message: 'Must be a string' })
  readonly date: string;

  // @ApiProperty({ example: '3' })
  @IsString({ message: 'Must be a string' })
  readonly projectId: string;
}
