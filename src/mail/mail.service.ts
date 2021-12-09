import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Surcrise } from 'src/surcrise/models/surcrise.interface';
import { User } from 'src/user/models/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = process.env.LOCALHOST+`users/confirmTokenEmail`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        url,
        token
      },
    });
  }

  async sendResetPassword(user: User, password: string) {
    // const url = process.env.TZ+`confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './resetpassword', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        password: password,
      },
    });
  }

  async sendSurcrise(result: Surcrise) {
    // const url = process.env.TZ+`confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: result.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Learn Vienamese',
      template: './surcriseEmail', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: result.name,
        phone: result.phone,
        date: result.surcrise_update
      },
    });
  }
}
