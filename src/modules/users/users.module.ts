import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { MailService } from '../auth/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken]), AuditLogsModule],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
