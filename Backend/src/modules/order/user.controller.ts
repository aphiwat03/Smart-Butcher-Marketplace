import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  createOrder(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.createOrderFromCart(userId, createOrderDto);
  }

  @Get('orders')
  getMyOrders(@Req() req: any) {
    const userId = req.user.userId;
    return this.orderService.getMyOrders(userId);
  }

  @Get('orders/:orderId')
  getOrderById(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.getOrderById(userId, orderId);
  }

  @Patch('orders/:orderId/cancel')
  cancelOrder(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.cancelOrder(userId, orderId);
  }

  @Patch('orders/:orderId/pay')
  payOrder(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.payOrder(userId, orderId);
  }
}
