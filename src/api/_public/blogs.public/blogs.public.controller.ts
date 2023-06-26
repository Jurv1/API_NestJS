import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { PostQ } from '../../../application/infrastructure/posts/posts.query.repository';
import { JwtService } from '@nestjs/jwt';
import { BlogQueryParams } from '../../../application/dto/blogs/dto/queries/blog.query.params';
import { queryValidator } from '../../../application/utils/sorts/_MongoSorts/sorting.func';
import { makePagination } from '../../../application/utils/make.paggination';
import { Errors } from '../../../application/utils/handle.error';
import { PostQuery } from '../../../application/dto/posts/dto/post.query';
import { filterForPublicBlogs } from '../../../application/utils/filters/_MongoFilters/filter.for.public.blogs';
import { BlogWithPaginationDto } from '../../../application/dto/blogs/dto/view/blog.with.pagination.dto';
import { BlogMapper } from '../../../application/utils/mappers/blog.mapper';
import { BlogsQueryRepository } from '../../../application/infrastructure/blogs/blogs.query.repository';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllBlogsQueryCommand } from './use-cases/query.use-cases/get.all.blogs.use-case';
import { GetOneBlogQueryCommand } from './use-cases/query.use-cases/get.one.blog.use-case';

@Controller('blogs')
export class PublicBlogController {
  constructor(
    private readonly queryBus: QueryBus,
    protected blogQ: BlogsQueryRepository,
    protected postQ: PostQ,
    private readonly jwtService: JwtService,
    private readonly blogMapper: BlogMapper,
  ) {}
  @Get()
  async getAll(@Query() query?: BlogQueryParams) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter = filterForPublicBlogs(searchNameTerm);
    const sort = queryValidator(sortBy, sortDirection);
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

    const sort = queryValidator(sortBy, sortDirection);
    const pagination = makePagination(pageNumber, pageSize);
    let userId = null;

    try {
      const blog = await this.blogQ.getOneBlog(id);
      if (!blog) throw new Errors.NOT_FOUND();
      const token = req.headers.authorization.split(' ')[1];
      const payload: any | null = (await this.jwtService.decode(token)) || null;
      if (payload) {
        userId = payload.userId;
      }
      return await this.postQ.getAllPostsByBlogId(id, sort, pagination, userId);
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }
}
