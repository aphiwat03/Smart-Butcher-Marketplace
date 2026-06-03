"use client";

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
} from "lucide-react";

export default function SellerDashboard() {
  const salesData = [
    { month: "Jan", sales: 4000, orders: 24 },
    { month: "Feb", sales: 3000, orders: 13 },
    { month: "Mar", sales: 2000, orders: 9 },
    { month: "Apr", sales: 2780, orders: 39 },
    { month: "May", sales: 1890, orders: 23 },
    { month: "Jun", sales: 2390, orders: 34 },
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: "฿18,060",
      icon: DollarSign,
      color: "text-[#B4915B]",
      bgColor: "bg-[#B4915B]/10",
    },
    {
      label: "Total Orders",
      value: "142",
      icon: ShoppingCart,
      color: "text-[#4E0707]",
      bgColor: "bg-[#4E0707]/10",
    },
    {
      label: "Active Products",
      value: "28",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Growth Rate",
      value: "+12.5%",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      product: "เนื้อวากิวคัดพิเศษ",
      customer: "สมชาย สุดหล่อ",
      amount: "฿899",
      status: "completed",
    },
    {
      id: "ORD-002",
      product: "เนื้อสันนอก",
      customer: "ศรีลักษณ์ ใจดี",
      amount: "฿699",
      status: "pending",
    },
    {
      id: "ORD-003",
      product: "เนื้อบด",
      customer: "ปิยะ อ่อนมาก",
      amount: "฿399",
      status: "completed",
    },
    {
      id: "ORD-004",
      product: "เนื้อสันใน",
      customer: "เอกพล สายเนื้อ",
      amount: "฿799",
      status: "processing",
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: "เนื้อวากิวคัดพิเศษ",
      sales: 45,
      revenue: "฿40,455",
    },
    {
      id: 2,
      name: "เนื้อสันนอก",
      sales: 32,
      revenue: "฿22,368",
    },
    {
      id: 3,
      name: "เนื้อบด",
      sales: 28,
      revenue: "฿11,172",
    },
    {
      id: 4,
      name: "เนื้อสันใน",
      sales: 19,
      revenue: "฿15,181",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#4E0707] mb-2">
          ยินดีต้อนรับ Seller Dashboard
        </h1>
        <p className="text-gray-600">จัดการร้านค้าและติดตามยอดขายของคุณ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-[#4E0707]">
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
          <h2 className="text-lg font-bold text-[#4E0707] mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
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
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
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
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#B4915B] transition-colors"
              >
                <div>
                  <p className="font-semibold text-[#4E0707]">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.product}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{order.amount}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${getStatusBadge(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-[#4E0707] mb-4">
            Top Products
          </h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
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
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <p className="font-bold text-[#B4915B]">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
