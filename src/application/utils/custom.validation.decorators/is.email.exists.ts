import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../infrastructure/users/users.query.repository';

@ValidatorConstraint({ name: 'IsEmailExists', async: true })
@Injectable()
export class IsEmailExistsProv implements ValidatorConstraintInterface {
  constructor(private readonly userQ: UsersQueryRepository) {}
  async validate(email: string) {
    const result = await this.userQ.getOneByLoginOrEmail(email);
    if (!result) return true;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Email ($value) is already taken!';
  }
}

export const IsEmailExists =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistsProv,
    });
  };
