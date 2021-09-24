import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_USER } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiOperation({ summary: 'Registration' })
  // @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe())
  @Post('/registration')
  async register(@Body() dto: AuthDto) {
    const candidate = await this.authService.findUser(dto.login);
    if (candidate) {
      throw new BadRequestException(ALREADY_REGISTERED_USER);
    }
    return this.authService.createUser(dto);
  }

  @HttpCode(200)
  // @ApiOperation({ summary: 'Log in' })
  // @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(@Body() { login, password }: AuthDto) {
    const user = await this.authService.validateUser(login, password);
    return this.authService.login(user.email);
  }
}
