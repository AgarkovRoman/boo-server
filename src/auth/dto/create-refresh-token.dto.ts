import { IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsString({ message: 'Must be a string' })
  readonly refreshToken: string;

  @IsString({ message: 'Must be a string' })
  readonly userId: string;
}
