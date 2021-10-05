import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
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

  private async generateToken(user: UserModel) {
    const payload = { id: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(userDto: AuthDto) {
    const user = await this.validateUser(userDto);
    const token = await this.generateToken(user);
    return {
      ...token,
      id: user._id,
    };
  }

  async registration(userDto: AuthDto) {
    const candidate = await this.findUserByEmail(userDto.login);
    if (candidate) {
      throw new BadRequestException(ALREADY_REGISTERED_USER);
    }
    const user = await this.createUser(userDto);
    const token = await this.generateToken(user);
    return {
      ...token,
      id: user._id,
    };
  }
}
