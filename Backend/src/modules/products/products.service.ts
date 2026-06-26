import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import { PrismaService } from '../../prisma-db/prisma.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { GetAdminProductsDto } from './dto/get-admin-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: GetProductsFilterDto) {
    const search = query.q?.trim();
    const category = query.category?.trim();
    const maxPrice = query.maxPrice;
    const minPrice = query.minPrice;
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      deletedAt: null,
      ...((maxPrice !== undefined && maxPrice > 0) || minPrice !== undefined
        ? {
            price: {
              ...(maxPrice !== undefined && maxPrice > 0 ? { lte: maxPrice } : {}),
              ...(minPrice !== undefined && minPrice > 0 ? { gte: minPrice } : {}),
            },
          }
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

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          category: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          reviews: {
            select: {
              point: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const data = products.map((product) => {
      const reviewCount = product.reviews.length;
      const averageRating = reviewCount > 0
        ? product.reviews.reduce((sum, review) => sum + review.point, 0) / reviewCount
        : 0;

      const { reviews, ...rest } = product;
      return {
        ...rest,
        averageRating,
        reviewCount,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllForAdmin(query: GetAdminProductsDto) {
    const search = query.q?.trim();
    const category = query.category?.trim();
    const page = query.page ?? 1;
    const limit = query.limit ?? 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const allowedSortFields = ['createdAt', 'updatedAt', 'price', 'name', 'stockQuantity'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.storeId ? { storeId: query.storeId } : {}),
      ...((query.maxPrice !== undefined && query.maxPrice > 0) || query.minPrice !== undefined
        ? {
            price: {
              ...(query.maxPrice !== undefined && query.maxPrice > 0 ? { lte: query.maxPrice } : {}),
              ...(query.minPrice !== undefined && query.minPrice > 0 ? { gte: query.minPrice } : {}),
            },
          }
        : {}),
      ...(category
        ? {
            category: {
              name: { equals: category, mode: 'insensitive' },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { store: { name: { contains: search, mode: 'insensitive' } } },
              { category: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [safeSortBy]: sortOrder },
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
      }),
      this.prisma.product.count({ where }),
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
          description: true,
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
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  async getCategoryNameById(id: number): Promise<string> {
    const category = await this.prisma.category.findUnique({
      where: { id }
    });
    return category?.name || '';
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

    const existingProduct = await this.prisma.product.findFirst({
      where: {
        storeId: store.id,
        name: createProductDto.name,
        deletedAt: null,
      }
    });

    if (existingProduct) {
      throw new BadRequestException('สินค้าชื่อนี้มีอยู่ในร้านของคุณแล้ว');
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
