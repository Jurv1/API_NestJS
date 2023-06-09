import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { BlogForAdminDto } from '../../dto/blogs/dto/blog.for.admin.dto';
import { BlogViewDto } from '../../dto/blogs/dto/blog.view.dto';

export class BlogMapper {
  mapBlog(obj: BlogDocument) {
    return {
      id: obj._id.toString(),
      name: obj.name,
      description: obj.description,
      websiteUrl: obj.websiteUrl,
      isMembership: obj.isMembership,
      createdAt: obj.createdAt,
    };
  }

  mapBlogs(objs: BlogDocument[] | BlogViewDto[]) {
    return objs.map((el) => {
      return {
        id: el._id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl,
        isMembership: el.isMembership,
        createdAt: el.createdAt,
      };
    });
  }

  async mapBlogsForAdmin(
    objs: BlogDocument[] | BlogForAdminDto[] | BlogViewDto[],
  ): Promise<BlogForAdminDto[]> {
    return objs.map((el) => {
      return {
        id: el._id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl,
        isMembership: el.isMembership,
        createdAt: el.createdAt,
        blogOwnerInfo: el.ownerInfo,
        banInfo: el.banInfo,
      };
    });
  }
}
