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

  @UsePipes(new ValidationPipe())
  // @ApiOperation({ summary: 'Log in' })
  // @ApiResponse({ status: 200 })
  @Post('/registration')
  async registration(@Body() dto: AuthDto) {
    return this.authService.registration(dto);
  }

  @HttpCode(200)
  // @ApiOperation({ summary: 'Log in' })
  // @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
