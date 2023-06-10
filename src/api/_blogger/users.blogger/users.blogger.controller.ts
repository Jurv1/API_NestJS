import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../_public/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../_public/auth/decorators/current-user.param.decorator';
import { BloggerBanDto } from '../../../application/dto/blogs/dto/blogger.ban.dto';
import { BlogDocument } from '../../../application/schemas/blogs/schemas/blogs.database.schema';
import { BlogQ } from '../../../application/infrastructure/blogs/blogs.query.repository';
import { Errors } from '../../../application/utils/handle.error';

@Controller('blogger/users')
export class UsersBloggerController {
  constructor(private readonly blogQ: BlogQ) {}
  @UseGuards(JwtAuthGuard)
  @Get('blog/:id')
  async getAllBannedUsersForBlog(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/ban')
  async banUnbanUserForBlog(
    @Param('id') id: string,
    @Body() body: BloggerBanDto,
    @CurrentUserId() userId: string,
  ) {}
}
