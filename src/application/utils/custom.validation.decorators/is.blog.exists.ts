import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure/blogs/blogs.query.repository';

@ValidatorConstraint({ name: 'IsBlogExists', async: true })
@Injectable()
export class IsBlogExists implements ValidatorConstraintInterface {
  constructor(private readonly blogQ: BlogsQueryRepository) {}
  async validate(blogId: string) {
    const result = await this.blogQ.getOneBlog(blogId);
    if (result.length !== 0) return true;
    //return !!result;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Blog ($value) is not existing!';
  }
}

export const IsBlogExist =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogExists,
    });
  };
