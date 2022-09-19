import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const PostPagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { page, cursor, published } = request.query;
    const boolPublished = published && published === 'false' ? false : true;
    return {
      page,
      cursor,
      published: boolPublished,
    };
  },
);
