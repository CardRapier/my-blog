import { Author, Post } from '@prisma/client';
import {
  BlogResponse,
  BlogResponseM,
  PaginationResponse,
} from './../common/interfaces/blog-response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PaginationQuery,
  Params,
  PostPaginationParams,
} from './../common/interfaces/generic.interfaces';
import {
  filterAuthorFromPost,
  filterAuthorFromPosts,
} from './../common/author.util';

import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { calculateSkip } from './../common/pagination.utils';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPostDto: CreatePostDto,
    author: Author,
  ): Promise<BlogResponseM<Post>> {
    const { id } = author;
    const newPost = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: id,
      },
    });

    return {
      data: newPost,
      message: 'Post created successfully',
    };
  }

  async findAll(
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<Post[]>> {
    const { published } = paginationQuery;
    const { params, count } = await this.getPaginationParams({
      ...paginationQuery,
    });

    let posts = await this.prisma.post.findMany({
      where: {
        published,
      },
      include: {
        author: true,
      },
      ...params,
    });

    if (posts.length > 0) posts = filterAuthorFromPosts(posts);

    return {
      data: posts,
      quantity: posts.length,
      total: count,
    };
  }

  async findAllByAuthor(
    authorId: number,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<Post[]>> {
    const { published } = paginationQuery;
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    });
    if (!author) throw new NotFoundException('Author Not Found');

    const where = { authorId: authorId };
    const { params, count } = await this.getPaginationParams(
      { ...paginationQuery },
      where,
    );

    let posts = await this.prisma.post.findMany({
      where: { ...where, published },
      include: {
        author: true,
      },
      ...params,
    });

    if (posts.length > 0) posts = filterAuthorFromPosts(posts);

    return {
      data: posts,
      quantity: posts.length,
      total: count,
    };
  }

  async togglePublish(id: number): Promise<BlogResponseM<boolean>> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    post.published = !post.published;
    await this.prisma.post.update({
      where: { id },
      data: { published: post.published },
    });
    const message = post.published
      ? 'Post has been published successfully'
      : 'Post has been unpublished successfully';
    return { data: post.published, message };
  }

  async findOne(id: number): Promise<BlogResponse<Post>> {
    let post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    post = filterAuthorFromPost(post);
    return {
      data: post,
    };
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<BlogResponseM<Post>> {
    let post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post Not Found');

    post = await this.prisma.post.update({
      where: { id },
      data: { ...updatePostDto },
    });

    return {
      data: post,
      message: 'Post updated successfully',
    };
  }

  async searchPost(
    title: string,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<Post[]>> {
    const { published } = paginationQuery;
    const { params, count } = await this.getPaginationParams({
      ...paginationQuery,
    });

    let posts = await this.prisma.post.findMany({
      where: {
        title: {
          contains: title,
        },
        published,
      },
      include: { author: true },
      ...params,
    });

    if (posts.length > 0) posts = filterAuthorFromPosts(posts);

    return {
      data: posts,
      quantity: posts.length,
      total: count,
    };
  }

  async getPaginationParams(
    { published, page, cursor }: PaginationQuery,
    count_params?: any,
  ): Promise<PostPaginationParams> {
    const skip = calculateSkip(page);
    const params: Params = {
      orderBy: {
        createdAt: 'desc',
      },
      skip: cursor ? 1 : skip,
      cursor: cursor ? { id: cursor } : undefined,
      take: 10,
    };
    const count = await this.prisma.post.count({
      where: { published, ...count_params },
    });

    return {
      params,
      count,
    };
  }
}
