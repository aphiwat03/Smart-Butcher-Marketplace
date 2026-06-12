import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.createOrderFromCart(userId, createOrderDto);
  }

  @Get()
  getMyOrders(@Req() req: any) {
    const userId = req.user.userId;
    return this.orderService.getMyOrders(userId);
  }

  @Get(':orderId')
  getOrderById(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.getOrderById(userId, orderId);
  }

  @Patch(':orderId/cancel')
  cancelOrder(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.cancelOrder(userId, orderId);
  }

  @Patch(':orderId/pay')
  payOrder(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.payOrder(userId, orderId);
  }
}
