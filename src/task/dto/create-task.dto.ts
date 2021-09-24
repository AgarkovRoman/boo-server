import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  readonly archived?: boolean;

  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  readonly date: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  readonly description?: string;

  @IsString({ message: 'Must be a string' })
  readonly userId: string;

  // @ApiProperty({ example: '3' })
  // @IsNumber({}, { message: 'Must be a string' })
  // readonly projectId: string;
}
