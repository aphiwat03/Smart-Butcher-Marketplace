import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma-db/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrderFromCart(userId: number, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stockQuantity: true,
                status: true,
                deletedAt: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('ไม่มีสินค้าในตะกร้า');
    }

    for (const item of cart.cartItems) {
      const product = item.product;

      if (product.status !== 'ACTIVE' || product.deletedAt !== null) {
        throw new BadRequestException(
          `สินค้า "${product.name}" ไม่พร้อมจำหน่ายในขณะนี้`,
        );
      }

      if (item.quantity > product.stockQuantity) {
        throw new BadRequestException(
          `สินค้า "${product.name}" มีจำนวนไม่พอ (เหลือเพียง ${product.stockQuantity} ชิ้น)`,
        );
      }
    }

    const totalAmount = cart.cartItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          orderStatus: 'PENDING',
          orderItems: {
            create: cart.cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, imageUrl: true },
              },
            },
          },
        },
      });

      for (const item of cart.cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'COMPLETED' },
      });

      return newOrder;
    });

    return {
      message: 'สร้างคำสั่งซื้อสำเร็จ',
      order,
    };
  }

  async getMyOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
      },
    });

    return orders;
  }

  async getOrderById(userId: number, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: Number(orderId),
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true, price: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('ไม่พบคำสั่งซื้อนี้');
    }

    return order;
  }

  async cancelOrder(userId: number, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: Number(orderId),
        userId,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException('ไม่พบคำสั่งซื้อนี้');
    }

    if (order.orderStatus !== 'PENDING') {
      throw new BadRequestException(
        `ไม่สามารถยกเลิกคำสั่งซื้อที่มีสถานะ "${order.orderStatus}" ได้`,
      );
    }

    const cancelledOrder = await this.prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
          },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: { orderStatus: 'CANCELLED' },
      });
    });

    return {
      message: 'ยกเลิกคำสั่งซื้อสำเร็จ',
      order: cancelledOrder,
    };
  }

  async payOrder(userId: number, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: Number(orderId),
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('ไม่พบคำสั่งซื้อนี้');
    }

    if (order.orderStatus !== 'PENDING') {
      throw new BadRequestException(
        `ไม่สามารถชำระเงินคำสั่งซื้อที่มีสถานะ "${order.orderStatus}" ได้`,
      );
    }

    const paidOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { orderStatus: 'PAID' },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
      },
    });

    return {
      message: 'ชำระเงินสำเร็จ',
      order: paidOrder,
    };
  }
}
