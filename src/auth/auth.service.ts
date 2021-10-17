import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  ALREADY_REGISTERED_USER,
  INVALID_EMAIL_OR_PASSWORD,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { RefreshTokenServiceService } from './refreshToken.service';
import { Types } from 'mongoose';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenServiceService: RefreshTokenServiceService,
  ) {}

  private async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
    return newUser.save();
  }

  private async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  private async validateUser(userDto: AuthDto): Promise<UserModel> {
    const user = await this.findUserByEmail(userDto.login);
    if (!user) {
      throw new UnauthorizedException({
        message: INVALID_EMAIL_OR_PASSWORD,
      });
    }
    const passwordEquals = await compare(userDto.password, user.passwordHash);
    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: INVALID_EMAIL_OR_PASSWORD,
      });
    }
    return user;
  }

  private async generateToken(id: Types.ObjectId) {
    return this.jwtService.signAsync(
      { id },
      {
        expiresIn: '30d',
      },
    );
  }

  async getUserIdFromJWT(req: {
    headers: { authorization: string };
  }): Promise<string> {
    const authHeader = req.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }
    try {
      const verifyUser = this.jwtService.verify(token);
      return verifyUser.id;
    } catch (e) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }
  }

  private async issueTokenPair(userId: string) {
    const refreshToken = uuid();
    await this.refreshTokenServiceService.createRefreshToken({
      refreshToken,
      userId,
    });
    const access_token = await this.generateToken(userId);
    return {
      access_token,
      refreshToken,
    };
  }

  async login(userDto: AuthDto) {
    const user = await this.validateUser(userDto);
    const tokenPair = await this.issueTokenPair(user.id);
    return {
      ...tokenPair,
      id: user.id,
    };
  }

  async registration(userDto: AuthDto) {
    const candidate = await this.findUserByEmail(userDto.login);
    if (candidate) {
      throw new BadRequestException(ALREADY_REGISTERED_USER);
    }
    const user = await this.createUser(userDto);
    const tokenPair = await this.issueTokenPair(user.id);
    return {
      ...tokenPair,
      id: user.id,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const { token: refreshToken, userId } = dto;
    const dbToken = await this.refreshTokenServiceService.findRefreshToken(
      refreshToken,
    );
    if (!dbToken) {
      throw new NotFoundException('refreshToken not found');
    }
    await this.refreshTokenServiceService.deleteRefreshToken(refreshToken);
    const tokenPair = await this.issueTokenPair(userId);
    return {
      ...tokenPair,
    };
  }

  async logout(token: string) {
    await this.refreshTokenServiceService.deleteRefreshToken(token);
    return {
      success: true,
    };
  }
}
