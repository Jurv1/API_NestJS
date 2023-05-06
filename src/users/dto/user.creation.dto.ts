export class UserCreationDto {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  isConfirmed: boolean;
}
