import { BlogDocument } from '../../schemas/blogs/schemas/blogs.database.schema';
import { BlogForAdminDto } from '../../dto/blogs/dto/blog.for.admin.dto';
import { BlogViewDto } from '../../dto/blogs/dto/view/blog.view.dto';

export class BlogMapper {
  mapBlog(obj: BlogDocument) {
    return {
      id: obj[0].Id.toString(),
      name: obj[0].Name,
      description: obj[0].Description,
      websiteUrl: obj[0].WebsiteUrl,
      isMembership: obj[0].IsMembership,
      createdAt: obj[0].CreatedAt,
    };
  }

  mapBlogs(objs: any) {
    return objs.map((el) => {
      return {
        id: el.Id.toString(),
        name: el.Name,
        description: el.Description,
        websiteUrl: el.WebsiteUrl,
        isMembership: el.IsMembership,
        createdAt: el.CreatedAt,
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
