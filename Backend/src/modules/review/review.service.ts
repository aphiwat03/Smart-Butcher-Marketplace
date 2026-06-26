import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma-db/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('ไม่พบสินค้านี้');
    }

    if (dto.orderId) {
      const orderItem = await this.prisma.orderItem.findFirst({
        where: {
          orderId: dto.orderId,
          productId: dto.productId,
          order: { userId },
        },
      });
      if (!orderItem) {
        throw new BadRequestException(
          'คุณไม่ได้สั่งซื้อสินค้านี้จากคำสั่งซื้อนี้',
        );
      }
    }

    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        productId: dto.productId,
        ...(dto.orderId ? { orderId: dto.orderId } : {}),
      },
    });
    if (existingReview) {
      throw new BadRequestException('คุณได้รีวิวสินค้านี้ไปแล้ว');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        orderId: dto.orderId ?? null,
        point: dto.point,
        description: dto.description,
      },
      include: {
        user: { select: { id: true, fullName: true } },
        product: { select: { id: true, name: true } },
      },
    });

    return review;
  }

  async findByProduct(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        point: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });
  }
}
