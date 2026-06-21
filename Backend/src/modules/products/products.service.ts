import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import { PrismaService } from '../../prisma-db/prisma.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetProductsFilterDto) {
    const search = query.q?.trim();
    const category = query.category?.trim();
    const maxPrice = query.maxPrice;

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      deletedAt: null,
      ...(maxPrice !== undefined && maxPrice > 0
        ? { price: { lte: maxPrice } }
        : {}),
      ...(category
        ? {
            category: {
              name: {
                equals: category,
                mode: 'insensitive',
              },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              {
                category: {
                  name: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    };

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findMyStoreProducts(userId: number, page: number = 1, limit: number = 8) {
    const store = await this.prisma.store.findFirst({
      where: { ownerUserId: userId },
    });

    if (!store) {
      throw new NotFoundException('ไม่พบร้านค้าที่ผูกกับบัญชีผู้ใช้นี้');
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          storeId: store.id,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          price: true,
          stockQuantity: true,
          status: true,
          imageUrl: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: {
          storeId: store.id,
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findMaxPrice() {
    return this.prisma.product.aggregate({
      _max: {
        price: true,
      },
    });
  }

  async create(
    createProductDto: CreateProductDto,
    userId: number,
    uploadedImageUrl?: string,
  ) {
    const store = await this.prisma.store.findFirst({
      where: { ownerUserId: userId },
    });

    if (!store) {
      throw new Error('ไม่พบร้านค้าที่ผูกกับบัญชีผู้ใช้นี้');
    }

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stockQuantity: createProductDto.stockQuantity,
        categoryId: createProductDto.categoryId,
        storeId: store.id,
        // 🌟 ถ้าระบบอัปโหลดไฟล์สำเร็จให้ใช้ค่าจากไฟล์ ถ้าไม่มีให้ใช้จากดีทีโอเดิม
        imageUrl: uploadedImageUrl || createProductDto.imageUrl,
        status: 'ACTIVE',
      },
      include: {
        category: true,
        store: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findById(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(updateProductDto.name && { name: updateProductDto.name }),
        ...(updateProductDto.description !== undefined && {
          description: updateProductDto.description,
        }),
        ...(updateProductDto.price !== undefined && {
          price: updateProductDto.price,
        }),
        ...(updateProductDto.stockQuantity !== undefined && {
          stockQuantity: updateProductDto.stockQuantity,
        }),
        ...(updateProductDto.categoryId && {
          categoryId: updateProductDto.categoryId,
        }),
        ...(updateProductDto.imageUrl !== undefined && {
          imageUrl: updateProductDto.imageUrl,
        }),
        ...(updateProductDto.status && { status: updateProductDto.status }),
      },
      include: {
        category: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findById(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
