"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_URL } from "@/lib/api";

interface DashboardTransaction {
  id: number;
  storeId: number;
  amount: number;
  description: string;
  createdAt: string;
}

interface DashboardOrderItem {
  quantity: number;
  subtotal: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
}

interface DashboardOrder {
  id: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  user: {
    fullName: string;
  };
  orderItems: DashboardOrderItem[];
}

interface DashboardTopProduct {
  id: number;
  name: string;
  imageUrl: string | null;
  totalSold: number;
}

interface DashboardChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface DashboardData {
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

interface AuthMeResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  store?: {
    id: number;
    ownerUserId: number;
    [key: string]: unknown;
  };
}

const formatCurrency = (value: number) => `฿${value.toLocaleString()}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  });

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const authHeaders: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // 1. Resolve the seller's storeId from /auth/me
        const meRes = await fetch(`${API_URL}/auth/me`, {
          headers: authHeaders,
        });

        if (!meRes.ok) {
          throw new Error(`Failed to load user (${meRes.status})`);
        }

        const me: AuthMeResponse = await meRes.json();
        const storeId = me.store?.id;

        if (!storeId) {
          throw new Error("ไม่พบร้านค้าของผู้ใช้นี้");
        }

        const res = await fetch(`${API_URL}/stores/${storeId}/dashboard`, {
          headers: authHeaders,
        });

        if (!res.ok) {
          throw new Error(`Failed to load dashboard (${res.status})`);
        }

        const json: DashboardData = await res.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      paid: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#B4915B] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 mb-1">
            ไม่สามารถโหลดข้อมูลแดชบอร์ดได้
          </h3>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(data.totalSales),
      icon: DollarSign,
      color: "text-[#B4915B]",
      bgColor: "bg-[#B4915B]/10",
    },
    {
      label: "Total Orders",
      value: data.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-[#4E0707]",
      bgColor: "bg-[#4E0707]/10",
    },
    {
      label: "Active Products",
      value: data.activeProductsCount.toString(),
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Growth Rate",
      value: `${data.growth.revenueGrowthPercent > 0 ? "+" : ""}${data.growth.revenueGrowthPercent}%`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-[#4E0707] mb-1 md:mb-2">
          ยินดีต้อนรับ {data.storeName}
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          จัดการร้านค้าและติดตามยอดขายของคุณ · ยอดคงเหลือ{" "}
          <span className="font-semibold text-[#B4915B]">
            {formatCurrency(data.balance)}
          </span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-[#4E0707]">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-base md:text-lg font-bold text-[#4E0707] mb-3 md:mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.charts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => formatDate(label as string)}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#B4915B"
                strokeWidth={2}
                dot={{ fill: "#B4915B" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-[#4E0707] mb-4">
            Orders Chart
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.charts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => formatDate(label as string)}
              />
              <Bar dataKey="orders" fill="#4E0707" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-[#4E0707] mb-4">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {data.recentOrders.length === 0 && (
              <p className="text-sm text-gray-500">ยังไม่มีคำสั่งซื้อ</p>
            )}
            {data.recentOrders.map((order) => {
              const firstItem = order.orderItems[0];
              const productLabel =
                order.orderItems.length > 1
                  ? `${firstItem?.product.name ?? "-"} +${order.orderItems.length - 1} รายการ`
                  : (firstItem?.product.name ?? "-");

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#B4915B] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#4E0707]">#{order.id}</p>
                    <p className="text-sm text-gray-600">{productLabel}</p>
                    <p className="text-xs text-gray-400">
                      {order.user.fullName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getStatusBadge(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-[#4E0707] mb-4">
            Top Products
          </h2>
          <div className="space-y-3">
            {data.topProducts.length === 0 && (
              <p className="text-sm text-gray-500">ยังไม่มีข้อมูลสินค้า</p>
            )}
            {data.topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#B4915B] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#B4915B] text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#4E0707]">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.totalSold} sales
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {data.recentTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-[#4E0707] mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-3">
            {data.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm text-gray-700">{tx.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
                <p className="font-bold text-[#B4915B]">
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            📢 Important Notice
          </h3>
          <p className="text-sm text-blue-800">
            Keep your product listings up-to-date and respond to customer
            messages within 24 hours to maintain high seller rating.
          </p>
        </div>
      </div>
    </div>
  );
}
