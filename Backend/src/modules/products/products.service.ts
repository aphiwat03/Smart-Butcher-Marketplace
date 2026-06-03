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

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stockQuantity: createProductDto.stockQuantity,
        categoryId: createProductDto.categoryId,
        storeId: createProductDto.storeId,
        imageUrl: createProductDto.imageUrl,
        status: ProductStatus.ACTIVE,
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Verify product exists
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
    // Verify product exists
    await this.findById(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
