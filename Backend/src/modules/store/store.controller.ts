import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerOrAdminGuard } from './guards/seller-or-admin.guard';
import { StoreService } from './store.service';

@Controller('stores')
@UseGuards(JwtAuthGuard, SellerOrAdminGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':id/dashboard')
  async getDashboard(
    @Param('id', ParseIntPipe) id: number,
    @Query('range') range?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.storeService.getDashboard(
      Number(id),
      range,
      startDate,
      endDate,
    );
  }
}
