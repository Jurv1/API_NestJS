import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { BlogForAdminDto } from '../../dto/blogs/dto/blog.for.admin.dto';
import { BlogViewDto } from '../../dto/blogs/dto/view/blog.view.dto';

export class BlogMapper {
  mapBlog(obj: BlogDocument) {
    return {
      id: obj[0].id.toString(),
      name: obj[0].name,
      description: obj[0].description,
      websiteUrl: obj[0].websiteUrl,
      isMembership: obj[0].isMembership,
      createdAt: obj[0].createdAt,
    };
  }

  mapBlogs(objs: any) {
    return objs.map((el) => {
      return {
        id: el.id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl,
        isMembership: el.isMembership,
        createdAt: el.createdAt,
      };
    });
  }

  mapBlogsForAdmin(
    objs: BlogDocument[] | BlogForAdminDto[] | BlogViewDto[],
  ): BlogForAdminDto[] {
    return objs.map((el) => {
      return {
        id: el.id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl,
        isMembership: el.isMembership,
        createdAt: el.createdAt,
        blogOwnerInfo: {
          userId: el.ownerId.toString(),
          userLogin: el.ownerLogin,
        },
        banInfo: {
          isBanned: el.isBanned,
          banDate: el.banDate,
        },
      };
    });
  }
}
