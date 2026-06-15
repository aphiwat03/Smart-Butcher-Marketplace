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

  async getCartItemCount(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) {
      return { totalItem: '0', totalPrice: '0' };
    }

    const totalItem = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalPrice = cart.cartItems.reduce((sum, item) => {
      const price = item.unitPrice;
      return sum + item.quantity * price;
    }, 0);

    return {
      totalItem,
      totalPrice,
    };
  }

  async getCartItems(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        cartItems: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            product: {
              select: {
                id: true,
                name: true,
                store: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
      },
    });
    return cart?.cartItems || [];
  }

  async updateItemQuantity(userId: number, itemId: string, quantity: number) {
    const currentQuantity = await this.prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cart: {
          userId: userId,
          status: 'ACTIVE',
        },
      },
    });
    if (!currentQuantity) {
      throw new NotFoundException('ไม่พบรายการสินค้านี้ในตะกร้า');
    }
    const updatedItem = await this.prisma.cartItem.update({
      where: {
        id: Number(itemId),
      },
      data: {
        quantity: quantity,
      },
    });
    return updatedItem;
  }

  async clearCart(userId: number) {
    const currentCart = await this.prisma.cart.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
      },
    });

    if (!currentCart) {
      return { message: 'ไม่มีสินค้าในตะกร้าอยู่แล้ว' };
    }

    const result = await this.prisma.cartItem.deleteMany({
      where: {
        cartId: currentCart.id,
      },
    });

    return {
      message: 'ล้างตะกร้าสำเร็จ',
      deletedCount: result.count,
    };
  }

  async removeItem(userId: number, itemId: string) {
    const currentItem = await this.prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cart: {
          userId: userId,
          status: 'ACTIVE',
        },
      },
    });

    if (!currentItem) {
      throw new NotFoundException(
        'ไม่พบสินค้านี้ในตะกร้าของคุณ หรือถูกลบไปแล้ว',
      );
    }

    const deletedItem = await this.prisma.cartItem.delete({
      where: {
        id: Number(itemId),
      },
    });

    return {
      message: 'ลบสินค้าออกจากตะกร้าสำเร็จ',
      item: deletedItem,
    };
  }
}
