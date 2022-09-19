import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAuthorDto } from './dto/register-author.dto';
import { LoginAuthorDto } from './dto/login-author.dto';
import { LowerEmailPipe } from 'src/common/pipes/lower-emal.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerAuthor(@Body(LowerEmailPipe) author: RegisterAuthorDto) {
    return this.authService.registerAuthor(author);
  }

  @Post('login')
  async loginUser(@Body(LowerEmailPipe) author: LoginAuthorDto) {
    return this.authService.loginAuthor(author);
  }
}
