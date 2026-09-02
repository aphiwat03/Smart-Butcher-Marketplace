import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrderStatus, PaymentStatus, StoreStatus } from '@prisma/client';
import { CreateStoreDto } from './dto/create-store.dto';
import { PrismaService } from '../../prisma-db/prisma.service';

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findAllForAdmin() {
    const stores = await this.prisma.store.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        Owner: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      ownerName: store.Owner.fullName,
      createdAt: store.createdAt,
      status: store.status,
    }));
  }

  async suspendForAdmin(storeId: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const suspendedStore = await this.prisma.store.update({
      where: { id: storeId },
      data: { status: StoreStatus.SUSPENDED },
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        Owner: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return {
      message: 'Store suspended successfully',
      store: {
        id: suspendedStore.id,
        name: suspendedStore.name,
        ownerName: suspendedStore.Owner.fullName,
        createdAt: suspendedStore.createdAt,
        status: suspendedStore.status,
      },
    };
  }

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

        const payload = {
          sub: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
          store: newStore,
          user: updatedUser,
          accessToken,
        };
      });

      return {
        message: 'เปิดร้านค้าสำเร็จและอัปเกรดสิทธิ์เป็น SELLER เรียบร้อยแล้ว',
        store: result.store,
        accessToken: result.accessToken,
      };
    } catch (error) {
      console.error('Error creating store:', error);
      throw new InternalServerErrorException('ไม่สามารถเปิดร้านค้าได้ในขณะนี้');
    }
  }

  async getDashboard(
    storeId: number,
    range?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: {
        name: true,
        balance: true,
        totalSales: true,
      },
    });

    if (!store) {
      throw new NotFoundException('ไม่พบข้อมูลร้านค้านี้');
    }

    const [
      itemsSoldAggregate,
      totalOrdersCount,
      recentTransactions,
      activeProductsCount,
      recentOrders,
      topProducts,
      growthData,
      chartsData,
    ] = await Promise.all([
      this.prisma.orderItem.aggregate({
        where: {
          product: { storeId: storeId },
          order: { orderStatus: 'PAID' },
        },
        _sum: { quantity: true },
      }),

      this.prisma.order.count({
        where: {
          orderItems: { some: { product: { storeId: storeId } } },
          orderStatus: 'PAID',
        },
      }),

      this.prisma.storeTransaction.findMany({
        where: { storeId: storeId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      this.getActiveProductsCount(storeId),
      this.getRecentOrders(storeId),
      this.getTopProducts(storeId),
      this.getGrowthRates(storeId),
      this.getChartsData(storeId, range, startDate, endDate),
    ]);

    return {
      storeName: store.name,
      balance: store.balance,
      totalSales: store.totalSales,
      totalItemsSold: itemsSoldAggregate._sum.quantity || 0,
      totalOrders: totalOrdersCount,
      recentTransactions: recentTransactions,
      activeProductsCount: activeProductsCount,
      recentOrders: recentOrders,
      topProducts: topProducts,
      growth: growthData,
      charts: chartsData,
    };
  }

  async getGrowthRates(storeId: number) {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    ); // วันสุดท้ายของเดือนที่แล้ว

    const thisMonthRevenue = await this.prisma.storeTransaction.aggregate({
      where: { storeId, createdAt: { gte: startOfThisMonth } },
      _sum: { amount: true },
    });
    const lastMonthRevenue = await this.prisma.storeTransaction.aggregate({
      where: {
        storeId,
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { amount: true },
    });

    const thisMonthOrders = await this.prisma.order.count({
      where: {
        orderItems: { some: { product: { storeId } } },
        orderStatus: 'PAID',
        createdAt: { gte: startOfThisMonth },
      },
    });
    const lastMonthOrders = await this.prisma.order.count({
      where: {
        orderItems: { some: { product: { storeId } } },
        orderStatus: 'PAID',
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    });

    const currentRev = thisMonthRevenue._sum.amount || 0;
    const lastRev = lastMonthRevenue._sum.amount || 0;

    const revenueGrowth =
      lastRev === 0
        ? currentRev > 0
          ? 100
          : 0
        : ((currentRev - lastRev) / lastRev) * 100;
    const ordersGrowth =
      lastMonthOrders === 0
        ? thisMonthOrders > 0
          ? 100
          : 0
        : ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;

    return {
      revenueGrowthPercent: parseFloat(revenueGrowth.toFixed(2)), // ปัดทศนิยม 2 ตำแหน่ง
      ordersGrowthPercent: parseFloat(ordersGrowth.toFixed(2)),
    };
  }

  async getChartsData(
    storeId: number,
    range: string = '30d',
    customStart?: string,
    customEnd?: string,
  ) {
    const TZ_OFFSET_MS = 7 * 60 * 60 * 1000; // ICT = UTC+7
    const toICT = (date: Date) => new Date(date.getTime() + TZ_OFFSET_MS);
    const nowICT = toICT(new Date());
    const nowUTC = new Date();

    let startDate: Date;
    let endDate: Date = nowUTC;
    let isMonthly = false;
    let isHourly = false;

    if (range === 'today') {
      startDate = new Date(
        Date.UTC(
          nowICT.getUTCFullYear(),
          nowICT.getUTCMonth(),
          nowICT.getUTCDate(),
        ) - TZ_OFFSET_MS,
      );
      isHourly = true;
    } else if (range === 'yesterday') {
      const yesterday = new Date(nowICT);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      startDate = new Date(
        Date.UTC(
          yesterday.getUTCFullYear(),
          yesterday.getUTCMonth(),
          yesterday.getUTCDate(),
        ) - TZ_OFFSET_MS,
      );
      endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1);
      isHourly = true;
    } else if (range === 'this_week') {
      const day = nowICT.getUTCDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(nowICT);
      monday.setUTCDate(monday.getUTCDate() + diffToMonday);
      startDate = new Date(
        Date.UTC(
          monday.getUTCFullYear(),
          monday.getUTCMonth(),
          monday.getUTCDate(),
        ) - TZ_OFFSET_MS,
      );
    } else if (range === 'this_month') {
      startDate = new Date(
        Date.UTC(nowICT.getUTCFullYear(), nowICT.getUTCMonth(), 1) -
          TZ_OFFSET_MS,
      );
    } else if (range === '7d') {
      startDate = new Date(nowUTC);
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === '30d') {
      startDate = new Date(nowUTC);
      startDate.setDate(startDate.getDate() - 30);
    } else if (range === '3m') {
      startDate = new Date(nowUTC);
      startDate.setMonth(startDate.getMonth() - 3);
      isMonthly = true;
    } else if (range === '1y') {
      startDate = new Date(nowUTC);
      startDate.setFullYear(startDate.getFullYear() - 1);
      isMonthly = true;
    } else if (range === 'custom' && customStart && customEnd) {
      startDate = new Date(customStart + 'T00:00:00+07:00');
      endDate = new Date(customEnd + 'T23:59:59+07:00');
    } else {
      startDate = new Date(nowUTC);
      startDate.setDate(startDate.getDate() - 30);
    }

    const [transactions, orders] = await Promise.all([
      this.prisma.storeTransaction.findMany({
        where: { storeId, createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true, amount: true },
      }),
      this.prisma.order.findMany({
        where: {
          orderItems: { some: { product: { storeId } } },
          orderStatus: 'PAID',
          createdAt: { gte: startDate, lte: endDate },
        },
        select: { createdAt: true, id: true },
      }),
    ]);

    const chartMap = new Map<
      string,
      { date: string; revenue: number; orders: number }
    >();

    const getDateKey = (date: Date): string => {
      const local = toICT(date);
      const y = local.getUTCFullYear();
      const m = String(local.getUTCMonth() + 1).padStart(2, '0');
      const d = String(local.getUTCDate()).padStart(2, '0');
      const h = String(local.getUTCHours()).padStart(2, '0');

      if (isHourly) return `${y}-${m}-${d}T${h}:00`;
      if (isMonthly) return `${y}-${m}`;
      return `${y}-${m}-${d}`;
    };

    if (isHourly) {
      const startICT = toICT(startDate);
      for (let h = 0; h < 24; h++) {
        const key = `${String(startICT.getUTCFullYear())}-${String(startICT.getUTCMonth() + 1).padStart(2, '0')}-${String(startICT.getUTCDate()).padStart(2, '0')}T${String(h).padStart(2, '0')}:00`;
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      }
    } else if (range === 'this_week') {
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate.getTime() + i * 86400000);
        const key = getDateKey(d);
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      }
    } else if (range === 'this_month') {
      const daysInMonth = new Date(
        nowICT.getUTCFullYear(),
        nowICT.getUTCMonth() + 1,
        0,
      ).getUTCDate();
      for (let i = 0; i < daysInMonth; i++) {
        const d = new Date(startDate.getTime() + i * 86400000);
        const key = getDateKey(d);
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      }
    } else if (range === '7d') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(
          nowUTC.getFullYear(),
          nowUTC.getMonth(),
          nowUTC.getDate() - i,
        );
        const key = getDateKey(d);
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      }
    } else if (range === '30d') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(
          nowUTC.getFullYear(),
          nowUTC.getMonth(),
          nowUTC.getDate() - i,
        );
        const key = getDateKey(d);
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      }
    } else if (range === '3m') {
      for (let i = 2; i >= 0; i--) {
        const d = new Date(nowUTC.getFullYear(), nowUTC.getMonth() - i, 1);
        const key = getDateKey(d);
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      }
    } else if (range === '1y') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(nowUTC.getFullYear(), nowUTC.getMonth() - i, 1);
        const key = getDateKey(d);
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      }
    }

    transactions.forEach((tx) => {
      const key = getDateKey(tx.createdAt);
      if (!chartMap.has(key))
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      chartMap.get(key)!.revenue += tx.amount;
    });

    orders.forEach((order) => {
      const key = getDateKey(order.createdAt);
      if (!chartMap.has(key))
        chartMap.set(key, { date: key, revenue: 0, orders: 0 });
      chartMap.get(key)!.orders += 1;
    });

    return Array.from(chartMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  async getActiveProductsCount(storeId: number) {
    return this.prisma.product.count({
      where: { storeId, status: 'ACTIVE' },
    });
  }

  async getRecentOrders(storeId: number) {
    return this.prisma.order.findMany({
      where: { orderItems: { some: { product: { storeId } } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        totalAmount: true,
        orderStatus: true,
        createdAt: true,

        user: {
          select: { fullName: true },
        },

        orderItems: {
          where: { product: { storeId: storeId } },
          select: {
            quantity: true,
            subtotal: true,
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async getTopProducts(storeId: number) {
    const topItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      where: {
        product: { storeId },
        order: { orderStatus: 'PAID' },
      },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const productIds = topItems.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, imageUrl: true },
    });

    return topItems.map((item) => ({
      ...products.find((p) => p.id === item.productId),
      totalSold: item._sum.quantity,
    }));
  }

  async getAdminDashboard() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalOrders,
      paidOrdersSummary,
      storePayoutSummary,
      currentMonthSalesSummary,
      pendingPaymentSlips,
      totalUsers,
      newCustomers,
      recentActivities,
      monthlyPaidOrders,
      topProductItems,
      platformTransactionSummary,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { orderStatus: OrderStatus.PAID },
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
        _count: { id: true },
      }),
      this.prisma.storeTransaction.aggregate({
        _sum: { amount: true },
      }),
      this.prisma.order.aggregate({
        where: {
          orderStatus: OrderStatus.PAID,
          createdAt: {
            gte: startOfCurrentMonth,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      this.prisma.payment.count({
        where: {
          status: PaymentStatus.PENDING,
        },
      }),
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
          },
        },
      }),
      this.prisma.storeTransaction.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          amount: true,
          description: true,
          createdAt: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.PAID,
          createdAt: {
            gte: startOfYear,
          },
        },
        select: {
          totalAmount: true,
          createdAt: true,
        },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            orderStatus: OrderStatus.PAID,
          },
        },
        _sum: {
          quantity: true,
          subtotal: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),
      this.prisma.platformTransaction.aggregate({
        _sum: { amount: true },
      }),
    ]);

    const grossRevenue = paidOrdersSummary._sum.totalAmount ?? 0;
    const storePayoutAmount = storePayoutSummary._sum.amount ?? 0;
    const platformEarnings = platformTransactionSummary._sum.amount ?? 0;
    const netRevenue = grossRevenue - storePayoutAmount;
    const monthlySales = this.mapMonthlySales(monthlyPaidOrders);
    const bestSellingProducts =
      await this.mapBestSellingProducts(topProductItems);

    return {
      totalOrders: paidOrdersSummary._count.id ?? 0,
      grossRevenue,
      storePayoutAmount,
      netRevenue,
      platformEarnings,
      averageOrderValue: paidOrdersSummary._avg.totalAmount ?? 0,
      newCustomers,
      monthlySales,
      bestSellingProducts,
      currentMonthSales: currentMonthSalesSummary._sum.totalAmount ?? 0,
      pendingPaymentSlips,
      totalUsers,
      recentActivities,
    };
  }

  private mapMonthlySales(
    orders: Array<{ totalAmount: number; createdAt: Date }>,
  ) {
    const monthlySalesMap = new Map<string, number>();

    orders.forEach((order) => {
      const month = order.createdAt.toISOString().slice(0, 7);
      monthlySalesMap.set(
        month,
        (monthlySalesMap.get(month) ?? 0) + order.totalAmount,
      );
    });

    return Array.from(monthlySalesMap.entries())
      .map(([month, totalSales]) => ({
        month,
        totalSales,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private async mapBestSellingProducts(
    topProductItems: Array<{
      productId: number;
      _sum: {
        quantity: number | null;
        subtotal: number | null;
      };
    }>,
  ) {
    const productIds = topProductItems.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return topProductItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      return {
        id: item.productId,
        name: product?.name ?? null,
        imageUrl: product?.imageUrl ?? null,
        store: product?.store ?? null,
        totalSold: item._sum.quantity ?? 0,
        totalSales: item._sum.subtotal ?? 0,
      };
    });
  }

  async getStorePublicInfo(storeId: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId, status: StoreStatus.OPEN },
      include: {
        products: {
          where: { status: 'ACTIVE', deletedAt: null },
          include: { category: true, reviews: true },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    let totalRating = 0;
    let reviewCount = 0;

    store.products.forEach((product) => {
      reviewCount += product.reviews.length;
      product.reviews.forEach((review) => {
        totalRating += review.point;
      });
    });

    const rating = reviewCount > 0 ? totalRating / reviewCount : 0;

    return {
      id: store.id,
      name: store.name,
      description: store.description,
      createdAt: store.createdAt,
      imageUrl: null,
      productCount: store.products.length,
      rating: rating,
      reviewCount: reviewCount,
      products: store.products.map((p) => {
        const { reviews, ...rest } = p;
        return rest;
      }),
    };
  }
}
