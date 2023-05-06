import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '../blogs.controller';
import { BlogService } from '../blogs.service';
import { BlogQ } from '../blogs.query.repository';
import { PostService } from '../../posts/posts.service';
import { PostQ } from '../../posts/posts.query.repository';

describe('BlogsController', () => {
  let blogsController: BlogController;

  const mockService = {};

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [BlogService, BlogQ, PostService, PostQ],
    })
      .overrideProvider(BlogService)
      .useValue(mockService)
      .overrideProvider(BlogQ)
      .useValue(mockService)
      .overrideProvider(PostService)
      .useValue(mockService)
      .overrideProvider(PostQ)
      .useValue(mockService)

      .compile();

    blogsController = app.get<BlogController>(BlogController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await blogsController.getAll()).toBe(200);
    });
  });
});
