import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreService } from './store.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly storeService: StoreService) {}

  @Get('stores')
  findAllStores() {
    return this.storeService.findAllForAdmin();
  }

  @Get('dashboard')
  getDashboard() {
    return this.storeService.getAdminDashboard();
  }

  @Patch('stores/:id/suspend')
  suspendStore(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.suspendForAdmin(id);
  }
}
