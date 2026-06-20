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
    });

    if (!payment) {
      throw new NotFoundException('ไม่พบข้อมูลสลิปการชำระเงินนี้');
    }
    const newOrderStatus = status === 'VERIFIED' ? 'PAID' : 'CANCELLED';
    const [updatedPayment, updatedOrder] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: paymentId },
        data: { status: status },
      }),

      this.prisma.order.update({
        where: { id: payment.orderId },
        data: { orderStatus: newOrderStatus },
      }),
    ]);

    return { message: 'อัปเดตสถานะสำเร็จ', updatedPayment, updatedOrder };
  }
}
