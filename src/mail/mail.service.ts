import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Subscribe } from 'src/subscribe/models/subscribe.interface';
import { User } from 'src/user/models/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = process.env.LOCALHOST+`users/confirmTokenEmail`;
    console.log(url, 'urlurlurl')
    console.log(user.email, 'user email')
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
    console.log(user.email);
  }

  async sendUserConfirmInformationV2(user: User, token: string, title: string, template: string) {
    const url = process.env.LOCALHOST+`users/confirmTokenEmail`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: title,
      template: template, 
      context: { 
        name: user.name,
        url,
        token
      },
    });
  }

  async sendResetPassword(user: User, password: string) {
    // const url = process.env.TZ+`confirm?token=${token}`;
    console.log(user.email)
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './resetpassword', 
      context: { 
        name: user.name,
        password: password,
      },
    });
  }

  async sendSurcrise(result: Subscribe) {
    // const url = process.env.TZ+`confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: result.email,
      subject: 'Welcome to Learn Vienamese',
      template: './surcriseEmail', 
      context: { 
        name: result.name,
        phone: result.phone,
        date: result.subscribe_update
      },
    });
  }
}
