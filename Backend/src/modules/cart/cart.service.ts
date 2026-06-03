import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AddToCartDto } from './dto/create-cart.dto';
import { PrismaService } from '../../prisma-db/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}
  async addToCart(userId: number, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: dto.productId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { price: true, stockQuantity: true },
    });

    if (!product) {
      throw new NotFoundException(`ไม่พบสินค้าหมายเลข ${dto.productId} ในระบบ`);
    }

    let cart = await this.prisma.cart.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: userId,
          status: 'ACTIVE',
        },
      });
    }

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + dto.quantity;
      if (newQuantity > product.stockQuantity) {
        throw new BadRequestException(
          `สินค้ามีจำนวนไม่พอ (เหลือเพียง ${product.stockQuantity} ชิ้น)`,
        );
      }

      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      if (dto.quantity > product.stockQuantity) {
        throw new BadRequestException(
          `สินค้ามีจำนวนไม่พอ (เหลือเพียง ${product.stockQuantity} ชิ้น)`,
        );
      }

      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          unitPrice: product.price,
        },
      });
    }
  }
}
