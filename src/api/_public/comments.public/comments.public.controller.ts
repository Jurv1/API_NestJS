import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Errors } from '../../../application/utils/handle.error';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContentDto } from '../../../application/dto/comments/dto/content.dto';
import { CurrentUserId } from '../auth/decorators/current-user.param.decorator';
import { LikeBody } from '../../../application/dto/likes/dto/like.body';
import { CurrentUserIdAndLogin } from '../auth/decorators/current-user.id.and.login';
import { UserIdAndLogin } from '../auth/dto/user-id.and.login';
import { CommandBus } from '@nestjs/cqrs';
import { GetCommentByIdCommand } from './use-cases/query.use-cases/get.comment.query.use-case';
import { UpdateCommentCommand } from './use-cases/command.use-cases/update.comment.use-case';
import { DeleteCommentCommand } from './use-cases/command.use-cases/delete.comment.use-case';
import { LikeCommentCommand } from './use-cases/command.use-cases/like.comment.use-case';

@Controller('comments')
export class PublicCommentController {
  constructor(private commandBus: CommandBus) {}

  @Get(':id')
  async getOneById(@Param('id') id: string, @Req() req: any) {
    let token;
    try {
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
      }
      return await this.commandBus.execute(
        new GetCommentByIdCommand(id, token),
      );
    } catch (err) {
      console.log(err);
      throw new Errors.NOT_FOUND();
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateOneById(
    @Param('id') id: string,
    @Body() body: ContentDto,
    @CurrentUserId() userId: string,
  ) {
    const content = body.content;
    return await this.commandBus.execute(
      new UpdateCommentCommand(id, content, userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteOneById(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.commandBus.execute(new DeleteCommentCommand(id, userId));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async likeComment(
    @Param('id') id: string,
    @Body() body: LikeBody,
    @CurrentUserIdAndLogin() user: UserIdAndLogin,
  ) {
    const likeStatus: string = body.likeStatus;
    const userId: string = user.userId;
    const userLogin: string = user.userLogin;

    return await this.commandBus.execute(
      new LikeCommentCommand(id, likeStatus, userId, userLogin),
    );
  }
}
