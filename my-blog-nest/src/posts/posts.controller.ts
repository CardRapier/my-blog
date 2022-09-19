import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
    @Param('id') authorId: string,
    @PostPagination() paginationQuery: PaginationQuery,
  ) {
    return this.postsService.findAllByAuthor(+authorId, paginationQuery);
  }

  @Post('togglePublish/:id')
  @Auth()
  async togglePublish(@Param('id') postId: string) {
    return this.postsService.togglePublish(+postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    console.log(updatePostDto);
    return this.postsService.update(+id, updatePostDto);
  }

  @Get('searchPost/:title')
  async searchPost(
    @Param('title') title: string,
    @PostPagination() paginationQuery: PaginationQuery,
  ) {
    return this.postsService.searchPost(title, paginationQuery);
  }
}
