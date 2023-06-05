import { BlogDocument } from '../../blogs/schemas/blogs.database.schema';
import { BlogForAdminDto } from '../../blogs/dto/blog.for.admin.dto';

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

  mapBlogs(objs: BlogDocument[]) {
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
    objs: BlogDocument[] | BlogForAdminDto[],
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
      };
    });
  }
}
