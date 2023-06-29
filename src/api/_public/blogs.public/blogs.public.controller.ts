import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlogQueryParams } from '../../../application/dto/blogs/dto/queries/blog.query.params';
import { makePagination } from '../../../application/utils/make.paggination';
import { Errors } from '../../../application/utils/handle.error';
import { PostQuery } from '../../../application/dto/posts/dto/post.query';
import { BlogsQueryRepository } from '../../../application/infrastructure/blogs/blogs.query.repository';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllBlogsQueryCommand } from './use-cases/query.use-cases/get.all.blogs.use-case';
import { GetOneBlogQueryCommand } from './use-cases/query.use-cases/get.one.blog.use-case';
import { PostsQueryRepository } from '../../../application/infrastructure/posts/posts.query.repository';
import { GetAllPostsByBlogIdQueryCommand } from './use-cases/query.use-cases/get.all.posts.by.blog.id.use-case';
import { ultimateSort } from '../../../application/utils/sorts/ultimate.sort';
import { EnumForPosts } from '../../../application/enums/enum.for.posts';
import { EnumForBlogs } from '../../../application/enums/emun.for.blogs';
import { filterForPublicBlogs } from '../../../application/utils/filters/filter.for.public.blogs';

@Controller('blogs')
export class PublicBlogController {
  constructor(
    private readonly queryBus: QueryBus,
    protected blogQ: BlogsQueryRepository,
    protected postQ: PostsQueryRepository,
    private readonly jwtService: JwtService,
  ) {}
  @Get()
  async getAll(@Query() query?: BlogQueryParams) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter = filterForPublicBlogs(searchNameTerm);
    const sort = ultimateSort(sortBy, sortDirection, EnumForBlogs);
    const pagination = makePagination(pageNumber, pageSize);

    return await this.queryBus.execute(
      new GetAllBlogsQueryCommand(filter, sort, pagination),
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetOneBlogQueryCommand(id));
  }

  @Get(':id/posts')
  async getPostsByBlogId(
    @Param('id') id: string,
    @Query() query: PostQuery,
    @Req() req: any,
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query;

    const sort = ultimateSort(sortBy, sortDirection, EnumForPosts);
    const pagination = makePagination(pageNumber, pageSize);
    let userId = null;

    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const payload: any | null =
          (await this.jwtService.decode(token)) || null;
        if (payload) {
          userId = payload.userId;
        }
      }
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
    return await this.queryBus.execute(
      new GetAllPostsByBlogIdQueryCommand(id, sort, pagination, userId),
    );
  }
}
