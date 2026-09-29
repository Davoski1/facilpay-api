import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from '../../common/constants/roles';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../users/user.entity';
import { AdminMerchantsService } from './admin-merchants.service';
import { ListAdminMerchantsDto } from './dto/list-admin-merchants.dto';

@ApiTags('admin')
@ApiBearerAuth('bearer')
@Controller('v1/admin/merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminMerchantsController {
  constructor(private readonly adminMerchantsService: AdminMerchantsService) {}

  @Get()
  @ApiOperation({ summary: 'List and search merchants (admin)' })
  @ApiOkResponse({
    description: 'Paginated merchant directory with 30-day metrics.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Admin role required.' })
  list(@Query() query: ListAdminMerchantsDto) {
    return this.adminMerchantsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant details (admin)' })
  @ApiOkResponse({ description: 'Merchant details and 30-day metrics.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Admin role required.' })
  getById(
    @Param('id') id: string,
    @CurrentUser() actor: User,
    @Req() request: Request,
  ) {
    return this.adminMerchantsService.getById(id, {
      id: actor.id,
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    });
  }
}
