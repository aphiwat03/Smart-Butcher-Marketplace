import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma-db/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

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
          shippingName: dto.shippingName,
          shippingPhone: dto.shippingPhone,
          shippingAddressText: dto.shippingAddressText,
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
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        if (updated.count === 0) {
          throw new BadRequestException(
            `ไม่สามารถสร้างคำสั่งซื้อได้ เนื่องจากสินค้าบางรายการมีการเปลี่ยนแปลงสต็อกกระทันหันและมีจำนวนไม่พอ`,
          );
        }
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

  async checkoutWithSlip(
    userId: number,
    dto: CreateOrderDto,
    amount: number,
    slipImageUrl: string,
  ) {
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
    }

    const totalAmount = cart.cartItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          orderStatus: 'PENDING',
          shippingName: dto.shippingName,
          shippingPhone: dto.shippingPhone,
          shippingAddressText: dto.shippingAddressText,
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

      // 2. Decrement Stock
      for (const item of cart.cartItems) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        if (updated.count === 0) {
          throw new BadRequestException(
            `ไม่สามารถสร้างคำสั่งซื้อได้ เนื่องจากสินค้าบางรายการมีการเปลี่ยนแปลงสต็อกกระทันหันและมีจำนวนไม่พอ`,
          );
        }
      }

      // 3. Complete Cart
      await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'COMPLETED' },
      });

      // 4. Create Payment Record
      const payment = await tx.payment.create({
        data: {
          orderId: newOrder.id,
          userId: userId,
          amount: amount,
          paymentMethod: 'BANK_TRANSFER',
          slipImageUrl: slipImageUrl,
          status: 'PENDING',
          paymentDate: new Date(),
        },
      });

      return { newOrder, payment };
    });

    return {
      message: 'อัปโหลดสลิปและสร้างคำสั่งซื้อสำเร็จ กรุณารอผู้ดูแลระบบตรวจสอบ',
      order: result.newOrder,
      payment: result.payment,
    };
  }

  async getMyOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        orderStatus: true,
        createdAt: true,
        reviews: {
          select: {
            productId: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            subtotal: true,
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                store: {
                  select: {
                    name: true,
                  },
                },
              },
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

  async getAllOrders(status?: OrderStatus) {
    const orders = await this.prisma.order.findMany({
      where: status ? { orderStatus: status } : {},
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        orderStatus: true,
        createdAt: true,

        user: {
          select: {
            fullName: true,
          },
        },

        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            slipImageUrl: true,
          },
        },

        orderItems: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return orders;
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

    const pendingPayment = await this.prisma.payment.findFirst({
      where: { orderId: order.id, status: 'PENDING' },
    });
    if (pendingPayment) {
      throw new BadRequestException(
        'ไม่สามารถยกเลิกได้ เนื่องจากคำสั่งซื้อนี้มีสลิปรอการตรวจสอบอยู่ กรุณารอผลการตรวจสอบสลิปก่อน',
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

  async getOrdersForSeller(storeId: number) {
    return this.prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: { storeId: storeId },
          },
        },
      },
      select: {
        id: true,
        totalAmount: true,
        orderStatus: true,
        createdAt: true,
        shippingAddressText: true,
        shippingPhone: true,
        user: {
          select: {
            fullName: true,
          },
        },
        orderItems: {
          where: {
            product: { storeId: storeId },
          },
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            subtotal: true,
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
