import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';

console.log(process.env.EMAIL, '    ', process.env.EMAIL_PASSWORD);
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      },
      defaults: { from: `Jeembo <${process.env.EMAIL}>` },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
