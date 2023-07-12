import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../infrastructure/users/users.query.repository';

@ValidatorConstraint({ name: 'IsLoginExists', async: true })
@Injectable()
export class IsLoginExistsProv implements ValidatorConstraintInterface {
  constructor(private readonly userQ: UsersQueryRepository) {}
  async validate(login: string) {
    const result = await this.userQ.getOneUserByLogin(login);
    if (!result) return true;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Login ($value) is already taken!';
  }
}

export const IsLoginExists =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLoginExistsProv,
    });
  };
