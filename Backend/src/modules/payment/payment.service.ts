import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma-db/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async processSlipUpload(userId: number, orderId: number, amount: number) {
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
        slipImageUrl: 'mock-slip-image-url.jpg',
        status: 'VERIFIED',
        paymentDate: new Date(),
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: 'PAID' },
    });

    return {
      message: 'บันทึกการชำระเงินสำเร็จ',
      payment,
    };
  }
}
