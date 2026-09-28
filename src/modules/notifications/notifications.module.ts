import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailLog } from './email-log.entity';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EmailNotificationService } from './email-notification.service';
import { EmailSuppression } from './email-suppression.entity';
import { EmailEventsService } from './email-events/email-events.service';
import { EmailEventsController } from './email-events/email-events.controller';
import { AdminEmailSuppressionsController } from './email-events/admin-email-suppressions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLog, EmailSuppression]),
    BullModule.registerQueue({
      name: 'emails',
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST', 'smtp.ethereal.email'),
          port: config.get<number>('SMTP_PORT', 587),
          secure: config.get<string>('SMTP_SECURE', 'false') === 'true',
          auth: {
            user: config.get<string>('SMTP_USER', ''),
            pass: config.get<string>('SMTP_PASS', ''),
          },
        },
        defaults: {
          from: config.get<string>(
            'SMTP_FROM',
            '"FacilPay" <noreply@facilpay.com>',
          ),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [EmailEventsController, AdminEmailSuppressionsController],
  providers: [EmailService, EmailProcessor, EmailNotificationService, EmailEventsService],
  exports: [EmailService, EmailNotificationService, EmailEventsService],
})
export class NotificationsModule {}
