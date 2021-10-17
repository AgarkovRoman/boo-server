import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe, UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

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

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  // @ApiOperation({ summary: 'Refresh' })
  // @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe())
  @Post('/refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  // @ApiOperation({ summary: 'Logout' })
  // @ApiResponse({ status: 200 })
  @UsePipes(new ValidationPipe())
  @Post('/logout')
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.token);
  }
}
