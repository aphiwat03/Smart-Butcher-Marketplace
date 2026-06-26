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

  async getDashboard(storeId: number) {
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
      this.getChartsData(storeId),
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

  async getChartsData(storeId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // เซ็ตเวลาย้อนหลังไป 30 วัน

    const transactions = await this.prisma.storeTransaction.findMany({
      where: { storeId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, amount: true },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        orderItems: { some: { product: { storeId } } },
        orderStatus: 'PAID',
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true, id: true },
    });

    const chartMap = new Map<
      string,
      { date: string; revenue: number; orders: number }
    >();

    transactions.forEach((tx) => {
      const dateString = tx.createdAt.toISOString().split('T')[0];

      if (!chartMap.has(dateString)) {
        chartMap.set(dateString, { date: dateString, revenue: 0, orders: 0 });
      }
      chartMap.get(dateString)!.revenue += tx.amount;
    });

    orders.forEach((order) => {
      const dateString = order.createdAt.toISOString().split('T')[0];

      if (!chartMap.has(dateString)) {
        chartMap.set(dateString, { date: dateString, revenue: 0, orders: 0 });
      }
      chartMap.get(dateString)!.orders += 1;
    });

    const sortedChartData = Array.from(chartMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sortedChartData;
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
    ]);

    const grossRevenue = paidOrdersSummary._sum.totalAmount ?? 0;
    const storePayoutAmount = storePayoutSummary._sum.amount ?? 0;
    const netRevenue = grossRevenue - storePayoutAmount;
    const monthlySales = this.mapMonthlySales(monthlyPaidOrders);
    const bestSellingProducts =
      await this.mapBestSellingProducts(topProductItems);

    return {
      totalOrders,
      grossRevenue,
      storePayoutAmount,
      netRevenue,
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
      products: store.products.map(p => {
        const { reviews, ...rest } = p;
        return rest;
      }),
    };
  }
}
