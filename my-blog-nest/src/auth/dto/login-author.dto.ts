import { IsEmail, IsString } from 'class-validator';
export class LoginAuthorDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
