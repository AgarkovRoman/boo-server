import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

	// @ApiOperation({ summary: 'Registration' })
	// @ApiResponse({ status: 200 })
	@Post('/register')
	async register(@Body() dto: AuthDto) {
		// return await this.authService.registration(userDto);
	}

	@HttpCode(200)
	// @ApiOperation({ summary: 'Log in' })
	// @ApiResponse({ status: 200 })
	@Post('/login')
	async login(@Body() dto: AuthDto) {
		// return await this.authService.login(userDto);
	}
}
