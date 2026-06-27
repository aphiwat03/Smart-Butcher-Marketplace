import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductStatus } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma-db/prisma.service';

describe('Products API (e2e)', () => {
  let app: INestApplication<App>;
  const productFindMany = jest.fn();
  const categoryFindMany = jest.fn();

  const prismaMock = {
    product: {
      findMany: productFindMany,
    },
    category: {
      findMany: categoryFindMany,
    },
  };

  const mockCategory = {
    id: 1,
    name: 'เนื้อสำหรับสเต็ก',
    description: 'รายละเอียดหมวดหมู่ เนื้อสำหรับสเต็ก',
    deletedAt: null,
    createdAt: new Date('2026-05-30T00:00:00.000Z'),
    updatedAt: new Date('2026-05-30T00:00:00.000Z'),
  };

  const mockProduct = {
    id: 1,
    storeId: 1,
    categoryId: 1,
    name: 'เนื้อสำหรับสเต็ก - เกรดพรีเมียม ชิ้นที่ 1',
    description: 'เหมาะสำหรับทำสเต็ก',
    price: 955,
    stockQuantity: 50,
    imageUrl: '/mock/category/พรีเมียมสเต็ก.jpg',
    status: ProductStatus.ACTIVE,
    deletedAt: null,
    createdAt: new Date('2026-05-30T00:00:00.000Z'),
    updatedAt: new Date('2026-05-30T00:00:00.000Z'),
    category: mockCategory,
    store: {
      id: 1,
      name: 'Smart Butcher Shop',
    },
  };

  beforeEach(async () => {
    productFindMany.mockReset();
    categoryFindMany.mockReset();
    productFindMany.mockResolvedValue([mockProduct]);
    categoryFindMany.mockResolvedValue([mockCategory]);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /products returns products from the database', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      category: {
        id: mockCategory.id,
        name: mockCategory.name,
      },
      store: {
        id: mockProduct.store.id,
        name: mockProduct.store.name,
      },
    });
    expect(productFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: ProductStatus.ACTIVE,
          deletedAt: null,
        }),
        include: expect.objectContaining({
          category: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        }),
      }),
    );
  });

  it('GET /products/categories returns categories from the database', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/categories')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: mockCategory.id,
      name: mockCategory.name,
    });
    expect(categoryFindMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  });

  it('GET /products builds search, category, and price filters', async () => {
    await request(app.getHttpServer())
      .get('/products')
      .query({
        q: 'สเต็ก',
        category: 'เนื้อสำหรับสเต็ก',
        maxPrice: '1000',
      })
      .expect(200);

    expect(productFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: ProductStatus.ACTIVE,
          deletedAt: null,
          price: { lte: 1000 },
          category: {
            name: {
              equals: 'เนื้อสำหรับสเต็ก',
              mode: 'insensitive',
            },
          },
          OR: [
            { name: { contains: 'สเต็ก', mode: 'insensitive' } },
            { description: { contains: 'สเต็ก', mode: 'insensitive' } },
            {
              category: {
                name: { contains: 'สเต็ก', mode: 'insensitive' },
              },
            },
          ],
        }),
      }),
    );
  });
});
