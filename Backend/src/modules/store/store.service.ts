import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { PrismaService } from '../../prisma-db/prisma.service';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createStoreDto: CreateStoreDto) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const newStore = await tx.store.create({
          data: {
            ownerUserId: userId,
            name: createStoreDto.name,
            description: createStoreDto.description,
          },
        });

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { role: 'SELLER' },
        });

        return {
          store: newStore,
          user: updatedUser,
        };
      });

      return {
        message: 'เปิดร้านค้าสำเร็จและอัปเกรดสิทธิ์เป็น SELLER เรียบร้อยแล้ว',
        store: result.store,
      };
    } catch (error) {
      console.error('Error creating store:', error);
      throw new InternalServerErrorException('ไม่สามารถเปิดร้านค้าได้ในขณะนี้');
    }
  }

  async findById(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });
    return store;
  }
}
