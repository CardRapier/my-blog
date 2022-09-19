import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthorDto } from './dto/login-author.dto';
import { PrismaService } from './../prisma/prisma.service';
import { RegisterAuthorDto } from './dto/register-author.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerAuthor(author: RegisterAuthorDto) {
    const { email, password } = author;
    let authorDb = await this.prisma.author.findUnique({ where: { email } });
    if (authorDb) throw new ConflictException('Author already exists');

    const hashedPassword = await hash(password, 10);
    author.password = hashedPassword;
    try {
      authorDb = await this.prisma.author.create({
        data: author,
      });

      const payload: JwtPayload = { email, sub: `${authorDb.id}` };
      const token = this.getJwtToken(payload);
      return {
        data: {
          token,
          name: authorDb.name,
        },
        message: 'Author created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating author');
    }
  }

  async loginAuthor(author: LoginAuthorDto) {
    const { email, password } = author;
    const authorDb = await this.prisma.author.findUnique({ where: { email } });
    if (!authorDb) throw new NotFoundException('Author not found');

    const isPasswordMatching = await compare(password, authorDb.password);
    if (!isPasswordMatching)
      throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { email, sub: `${authorDb.id}` };
    const token = this.getJwtToken(payload);
    return {
      data: token,
      name: authorDb.name,
      message: 'Author logged in successfully',
    };
  }

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
