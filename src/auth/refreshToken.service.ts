import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { RefreshTokenModel } from './refreshToken.model';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';

@Injectable()
export class RefreshTokenServiceService {
  constructor(
    @InjectModel(RefreshTokenModel)
    private readonly refreshTokenModel: ModelType<RefreshTokenModel>,
  ) {}

  async findRefreshToken(refreshToken: string) {
    return this.refreshTokenModel.findOne({ refreshToken }).exec();
  }

  async createRefreshToken(dto: CreateRefreshTokenDto) {
    return this.refreshTokenModel.create(dto);
  }

  async deleteRefreshToken(refreshToken: string) {
    return this.refreshTokenModel.findOneAndDelete({ refreshToken }).exec();
  }
}
