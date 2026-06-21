import { ReactNode } from "react";

export interface DashboardTransaction {
  id: number;
  storeId: number;
  amount: number;
  description: string;
  createdAt: string;
}

export interface DashboardOrderItem {
  quantity: number;
  subtotal: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
}

export interface DashboardOrder {
  id: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  user: {
    fullName: string;
  };
  orderItems: DashboardOrderItem[];
}

export interface DashboardTopProduct {
  id: number;
  name: string;
  imageUrl: string | null;
  totalSold: number;
}

export interface DashboardChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardData {
  storeName: string;
  balance: number;
  totalSales: number;
  totalItemsSold: number;
  totalOrders: number;
  recentTransactions: DashboardTransaction[];
  activeProductsCount: number;
  recentOrders: DashboardOrder[];
  topProducts: DashboardTopProduct[];
  growth: {
    revenueGrowthPercent: number;
    ordersGrowthPercent: number;
  };
  charts: DashboardChartPoint[];
}

export interface SellerOrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
}

export interface SellerOrder {
  id: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  shippingAddressText: string;
  shippingPhone: string;
  user: {
    fullName: string;
  };
  orderItems: SellerOrderItem[];
}

export interface SellerLayoutProps {
  children: ReactNode;
}
