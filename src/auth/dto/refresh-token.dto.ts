import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  token: string;

  @IsString()
  userId: string;
}
