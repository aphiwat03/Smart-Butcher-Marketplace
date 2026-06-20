import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma-db/prisma.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        role: true,
      },
    });
  }

  async changePasswordForAdmin(userId: number, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        role: true,
      },
    });

    return {
      message: 'Password changed successfully',
      user: updatedUser,
    };
  }

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
