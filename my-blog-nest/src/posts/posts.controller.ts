import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Author } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAuthor } from 'src/auth/decorators/get-author.decorator';
import { PostPagination } from 'src/common/decorators/post-pagination.decorator';
import { PaginationQuery } from './../common/interfaces/generic.interfaces';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth()
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetAuthor() author: Author,
  ) {
    return this.postsService.create(createPostDto, author);
  }

  @Get()
  async findAll(@PostPagination() paginationQuery: PaginationQuery) {
    return this.postsService.findAll(paginationQuery);
  }

  @Get('byAuthor/:id')
  async findAllByAuthor(
    @Param('id', ParseIntPipe) authorId: number,
    @PostPagination() paginationQuery: PaginationQuery,
  ) {
    return this.postsService.findAllByAuthor(authorId, paginationQuery);
  }

  @Post('togglePublish/:id')
  @Auth()
  async togglePublish(@Param('id', ParseIntPipe) postId: number) {
    return this.postsService.togglePublish(postId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Get('searchPost/:title')
  async searchPost(
    @Param('title') title: string,
    @PostPagination() paginationQuery: PaginationQuery,
  ) {
    return this.postsService.searchPost(title, paginationQuery);
  }
}
