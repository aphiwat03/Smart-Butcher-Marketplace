import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerOrAdminGuard } from './guards/seller-or-admin.guard';
import { OrderService } from './order.service';

@Controller('stores')
@UseGuards(JwtAuthGuard, SellerOrAdminGuard)
export class StoreController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':storeId/orders')
  async getOrdersForSeller(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.orderService.getOrdersForSeller(storeId);
  }
}
