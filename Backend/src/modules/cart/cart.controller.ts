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
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    console.log('ข้อมูล User ที่ได้จาก Token:', req.user);
    const userId = req.user.userId;

    return this.cartService.addToCart(userId, addToCartDto);
  }
}
