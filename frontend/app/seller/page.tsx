"use client";
import { fetchApi } from "@/lib/api";
import { useEffect, useState, useMemo, useCallback } from "react";
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
import { AuthMeResponse } from "@/types/auth";
import { DashboardData, DashboardChartPoint } from "@/types/seller";
import { TailwindDropdown } from "@/components/ui/tailwind-dropdown";
import { Spinner, FullPageLoader } from "@/components/ui/spinner";

const CHART_TYPE_OPTIONS = [
  { value: "sales", label: "Sales Trend (รายได้)" },
  { value: "orders", label: "Orders Chart (คำสั่งซื้อ)" },
];

const TIME_RANGE_OPTIONS = [
  { value: "7d", label: "7 วันล่าสุด (รายวัน)" },
  { value: "30d", label: "30 วันล่าสุด (รายวัน)" },
  { value: "3m", label: "3 เดือนล่าสุด (รายเดือน)" },
  { value: "1y", label: "1 ปีล่าสุด (รายเดือน)" },
];

const formatCurrency = (value: number) => `฿${value.toLocaleString()}`;

const formatCompactCurrency = (value: number) => {
  if (value >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `฿${formatted}M`;
  }
  if (value >= 1_000) {
    const formatted = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `฿${formatted}k`;
  }
  return `฿${value}`;
};

const formatCompactNumber = (value: number) => {
  if (value >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}M`;
  }
  if (value >= 1_000) {
    const formatted = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}k`;
  }
  return `${value}`;
};

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetchingChart, setIsFetchingChart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d"); // Default 30 days
  const [chartType, setChartType] = useState<"sales" | "orders">("sales");

  const [dashboardCache, setDashboardCache] = useState<
    Record<string, DashboardData>
  >({});

  const formatChartDate = useCallback(
    (value: string) => {
      const date = new Date(value);
      if (timeRange === "3m" || timeRange === "1y") {
        return date.toLocaleDateString("th-TH", {
          month: "short",
        });
      }
      if (timeRange === "30d" || timeRange === "7d") {
        return date.getDate().toString();
      }

      return date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
      });
    },
    [timeRange],
  );

  const formatTooltipDate = useCallback((value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    if (dashboardCache[timeRange]) {
      setData(dashboardCache[timeRange]);
      return;
    }

    const fetchDashboard = async () => {
      try {
        setIsFetchingChart(true);
        setError(null);

        const authHeaders: HeadersInit = {
          "Content-Type": "application/json",
        };

        const meRes = await fetchApi(`/auth/me`, {
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

        const res = await fetchApi(
          `/stores/${storeId}/dashboard?range=${timeRange}`,
          {
            headers: authHeaders,
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to load dashboard (${res.status})`);
        }

        const json: DashboardData = await res.json();
        setDashboardCache((prev) => ({ ...prev, [timeRange]: json }));
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        );
      } finally {
        setInitialLoading(false);
        setIsFetchingChart(false);
      }
    };

    fetchDashboard();
  }, [timeRange, dashboardCache]);

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

  const emptyPlaceholderData: DashboardChartPoint[] = useMemo(() => {
    const result: DashboardChartPoint[] = [];
    const now = new Date();

    if (timeRange === "7d") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - i,
        );
        result.push({ date: d.toISOString(), revenue: 0, orders: 0 });
      }
    } else if (timeRange === "30d") {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - i,
        );
        result.push({ date: d.toISOString(), revenue: 0, orders: 0 });
      }
    } else if (timeRange === "3m") {
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({ date: d.toISOString(), revenue: 0, orders: 0 });
      }
    } else {
      for (let i = 11; i >= 0; i -= 2) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({ date: d.toISOString(), revenue: 0, orders: 0 });
      }
    }
    return result;
  }, [timeRange]);

  if (initialLoading && !data) {
    return <FullPageLoader />;
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

  const hasSalesData = data.charts.some((c) => (c.revenue ?? 0) > 0);
  const hasOrdersData = data.charts.some((c) => (c.orders ?? 0) > 0);
  const chartDataToRender =
    data.charts.length > 0 ? data.charts : emptyPlaceholderData;

  return (
    <div className="space-y-8">

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

      <div className="bg-white rounded-xl shadow-md p-6 relative col-span-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#4E0707]">
              {chartType === "sales"
                ? "Sales Trend (แนวโน้มรายได้)"
                : "Orders Chart (แนวโน้มคำสั่งซื้อ)"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {chartType === "sales"
                ? "แสดงยอดรายได้รวมตามช่วงเวลาที่เลือก"
                : "แสดงจำนวนคำสั่งซื้อรวมตามช่วงเวลาที่เลือก"}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Select Chart Type */}
            <TailwindDropdown
              value={chartType}
              onChange={(val) => setChartType(val as "sales" | "orders")}
              options={CHART_TYPE_OPTIONS}
              className="w-full sm:w-[200px]"
            />

            {/* Select Time Range */}
            <TailwindDropdown
              value={timeRange}
              onChange={(val) => setTimeRange(val)}
              options={TIME_RANGE_OPTIONS}
              className="w-full sm:w-[190px]"
            />
          </div>
        </div>

        <div
          className={`relative transition-opacity duration-200 ${
            isFetchingChart ? "opacity-40" : "opacity-100"
          }`}
        >
          {isFetchingChart && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Spinner size="md" />
            </div>
          )}

          {/* Empty State Overlay */}
          {!isFetchingChart &&
            ((chartType === "sales" && !hasSalesData) ||
              (chartType === "orders" && !hasOrdersData)) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mt-16">
                <div className="bg-white/90 px-4 py-2 rounded-md shadow text-sm text-gray-500 font-medium border border-gray-200">
                  {chartType === "sales"
                    ? "ยังไม่มีข้อมูลยอดขาย"
                    : "ยังไม่มีข้อมูลคำสั่งซื้อ"}
                </div>
              </div>
            )}

          {/* Unified Line Chart */}
          <ResponsiveContainer width="100%" height={370}>
            {chartType === "sales" ? (
              <LineChart
                data={chartDataToRender}
                margin={{ top: 15, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={hasSalesData ? 1 : 0.4}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                  opacity={hasSalesData ? 1 : 0.5}
                  label={{
                    value:
                      timeRange === "3m" || timeRange === "1y"
                        ? "เดือน"
                        : "วันที่",
                    position: "insideBottom",
                    offset: -12,
                    fill: "#6B7280",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  domain={[
                    0,
                    (dataMax: number) =>
                      dataMax <= 0 ? 10000 : Math.ceil(dataMax * 1.2),
                  ]}
                  opacity={hasSalesData ? 1 : 0.5}
                  tickFormatter={formatCompactCurrency}
                  width={75}
                  label={{
                    value: "รายได้ (บาท)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -5,
                    fill: "#6B7280",
                    fontSize: 12,
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => formatTooltipDate(label as string)}
                  formatter={(value) => [
                    `฿${Number(value).toLocaleString()}`,
                    "รายได้",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B4915B"
                  strokeWidth={2.5}
                  dot={{ fill: "#B4915B", r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
              </LineChart>
            ) : (
              <LineChart
                data={chartDataToRender}
                margin={{ top: 15, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={hasOrdersData ? 1 : 0.4}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                  opacity={hasOrdersData ? 1 : 0.5}
                  label={{
                    value:
                      timeRange === "3m" || timeRange === "1y"
                        ? "เดือน"
                        : "วันที่",
                    position: "insideBottom",
                    offset: -12,
                    fill: "#6B7280",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  domain={[
                    0,
                    (dataMax: number) =>
                      dataMax <= 0 ? 10 : Math.ceil(dataMax * 1.2),
                  ]}
                  opacity={hasOrdersData ? 1 : 0.5}
                  allowDecimals={false}
                  tickFormatter={formatCompactNumber}
                  width={70}
                  label={{
                    value: "คำสั่งซื้อ (รายการ)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -5,
                    fill: "#6B7280",
                    fontSize: 12,
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => formatTooltipDate(label as string)}
                  formatter={(value) => [
                    `${Number(value).toLocaleString()} รายการ`,
                    "คำสั่งซื้อ",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#B4915B"
                  strokeWidth={2.5}
                  dot={{ fill: "#B4915B", r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
              </LineChart>
            )}
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
            {data.recentOrders.slice(0, 5).map((order) => {
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
            {data.topProducts.slice(0, 5).map((product, index) => (
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
            {data.recentTransactions.slice(0, 5).map((tx) => (
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
    </div>
  );
}
