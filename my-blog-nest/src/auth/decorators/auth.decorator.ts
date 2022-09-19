import { UseGuards, applyDecorators } from '@nestjs/common';

import { JwtGuard } from './../jwt/jwt.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(JwtGuard));
};
