import { BadRequestException, NotFoundException } from '@nestjs/common';

export const Errors = {
  BAD_REQUEST: BadRequestException,
  NOT_FOUND: NotFoundException,
};
