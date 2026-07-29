import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly orderService: OrderService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('orders')
  createOrder(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.createOrderFromCart(userId, createOrderDto);
  }

  @Post('checkout')
  @UseInterceptors(FileInterceptor('file'))
  async checkout(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body('shippingName') shippingName: string,
    @Body('shippingPhone') shippingPhone: string,
    @Body('shippingAddressText') shippingAddressText: string,
    @Body('amount') amount: string,
  ) {
    const userId = req.user.userId;

    if (!file) {
      throw new BadRequestException('Please upload a payment slip.');
    }

    const slipImageUrl = await this.supabaseService.uploadImage(
      file,
      'products',
      'slip',
    );

    if (!slipImageUrl) {
      throw new BadRequestException('Image upload failed');
    }

    const createOrderDto: CreateOrderDto = {
      shippingName,
      shippingPhone,
      shippingAddressText,
    };

    return this.orderService.checkoutWithSlip(
      userId,
      createOrderDto,
      Number(amount),
      slipImageUrl,
    );
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
