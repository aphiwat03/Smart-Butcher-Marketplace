import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user.userId;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Get('count/total')
  getCartItemCount(@Req() req: any) {
    const userId = req.user.userId;
    return this.cartService.getCartItemCount(userId);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.cartService.getCartItems(userId);
  }

  @Patch(':itemId')
  countItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
  ) {
    const userId = req.user.userId;
    return this.cartService.updateItemQuantity(userId, itemId, body.quantity);
  }

  @Delete()
  clearCart(@Req() req: any) {
    const userId = req.user.userId;
    return this.cartService.clearCart(userId);
  }

  @Delete(':itemId')
  removeItem(@Req() req: any, @Param('itemId') itemId: string) {
    const userId = req.user.userId;
    return this.cartService.removeItem(userId, itemId);
  }
}
