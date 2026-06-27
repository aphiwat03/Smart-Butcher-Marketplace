import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { OrderService } from './order.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly orderService: OrderService) {}

  @Get('orders')
  async getAdminOrders(@Query('status') status?: OrderStatus) {
    return this.orderService.getAllOrders(status);
  }
}
