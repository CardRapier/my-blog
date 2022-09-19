import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

import { Author } from '@prisma/client';

export const GetAuthor = createParamDecorator(
  (data, ctx: ExecutionContext): Author => {
    const req = ctx.switchToHttp().getRequest();
    const author = req.user;
    if (!author)
      throw new InternalServerErrorException('Author not found (request)');
    return author;
  },
);
