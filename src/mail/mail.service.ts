import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    email: string,
    subject: string,
    login: string,
    confirmationCode: string,
  ) {
    const url = `example.com/auth/confirm?code=${confirmationCode}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <bushmanhik2@gmail.com>', // override default from
      subject: subject,
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        login: login,
        url,
      },
    });
  }

  async sendPasswordRecoveryMessage(
    email: string,
    subject: string,
    login: string,
    code: string,
  ) {
    const url = `example.com/auth/confirm?recoveryCode=${code}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <bushmanhik2@gmail.com>', // override default from
      subject: subject,
      template: './recovery', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        login: login,
        url,
      },
    });
  }
}
