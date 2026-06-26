import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma-db/prisma.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async processSlipUpload(userId: number, orderId: number, amount: number, slipImageUrl: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId: userId },
    });

    if (!order) {
      throw new BadRequestException('ไม่พบคำสั่งซื้อนี้ในระบบ');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: orderId,
        userId: userId,
        amount: amount,
        paymentMethod: 'BANK_TRANSFER',
        slipImageUrl: slipImageUrl,
        status: 'PENDING',
        paymentDate: new Date(),
      },
    });

    return {
      message: 'อัปโหลดสลิปสำเร็จ กรุณารอผู้ดูแลระบบตรวจสอบ',
      payment,
    };
  }

  async verifyPaymentSlip(paymentId: number, status: 'VERIFIED' | 'REJECTED') {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('ไม่พบข้อมูลสลิปการชำระเงินนี้');
    }
    
    const newOrderStatus = status === 'VERIFIED' ? 'PAID' : 'CANCELLED';
    
    const prismaOperations: any[] = [
      this.prisma.payment.update({
        where: { id: paymentId },
        data: { status: status },
      }),
      this.prisma.order.update({
        where: { id: payment.orderId },
        data: { orderStatus: newOrderStatus },
      }),
    ];

    if (status === 'VERIFIED') {
      const storeEarnings = new Map<number, number>();
      for (const item of payment.order.orderItems) {
        const storeId = item.product.storeId;
        storeEarnings.set(storeId, (storeEarnings.get(storeId) || 0) + item.subtotal);
      }

      for (const [storeId, amount] of storeEarnings.entries()) {
        prismaOperations.push(
          this.prisma.store.update({
            where: { id: storeId },
            data: {
              balance: { increment: amount },
              totalSales: { increment: amount },
            },
          })
        );
        prismaOperations.push(
          this.prisma.storeTransaction.create({
            data: {
              storeId: storeId,
              amount: amount,
              description: `รายรับจากคำสั่งซื้อ #${payment.orderId}`,
            },
          })
        );
      }
    }

    const results = await this.prisma.$transaction(prismaOperations);

    return { 
      message: 'อัปเดตสถานะสำเร็จ', 
      updatedPayment: results[0], 
      updatedOrder: results[1] 
    };
  }
}
