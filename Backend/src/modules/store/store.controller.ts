import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerOrAdminGuard } from './guards/seller-or-admin.guard';
import { StoreService } from './store.service';

@Controller('stores')
@UseGuards(JwtAuthGuard, SellerOrAdminGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @Get(':id/dashboard')
  async getDashboard(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.getDashboard(Number(id));
  }
}
