import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma-db/prisma.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserAddress(userId: number, dto: CreateUserAddressDto) {
    const existingCount = await this.prisma.userAddress.count({
      where: { userId },
    });

    const isDefault = dto.isDefault ?? existingCount === 0;

    if (isDefault && existingCount > 0) {
      await this.prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.create({
      data: {
        userId,
        title: dto.title || 'บ้าน',
        receiverName: dto.receiverName,
        phoneNumber: dto.phoneNumber,
        addressLine: dto.addressLine,
        city: dto.city,
        postalCode: dto.postalCode,
        isDefault,
      },
    });
  }

  async getUserAddresses(userId: number) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async deleteUserAddress(userId: number, addressId: number) {
    const address = await this.prisma.userAddress.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    if (!address) {
      throw new NotFoundException(
        'ไม่พบที่อยู่ที่ต้องการลบ หรือคุณไม่มีสิทธิ์',
      );
    }

    await this.prisma.userAddress.delete({
      where: { id: addressId },
    });

    return { message: 'ลบที่อยู่สำเร็จ' };
  }

  async updateUserAddress(
    userId: number,
    addressId: number,
    dto: UpdateUserAddressDto,
  ) {
    const existingAddress = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('ไม่พบที่อยู่ที่ต้องการแก้ไข');
    }

    if (dto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: {
        title: dto.title,
        receiverName: dto.receiverName,
        phoneNumber: dto.phoneNumber,
        addressLine: dto.addressLine,
        city: dto.city,
        postalCode: dto.postalCode,
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });
  }
}
