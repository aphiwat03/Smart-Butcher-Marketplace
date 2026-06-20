"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { API_URL } from "@/lib/api";

interface MonthlySale {
  month: string;
  totalSales: number;
}

interface BestSellingProduct {
  id: number;
  name: string | null;
  imageUrl: string | null;
  totalSold: number;
  totalSales: number;
  store: {
    id: number;
    name: string;
  } | null;
}

interface AnalyticsDashboard {
  netRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  monthlySales: MonthlySale[];
  bestSellingProducts: BestSellingProduct[];
}

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatMonth(month: string) {
  const date = new Date(`${month}-01T00:00:00`);

  return date.toLocaleDateString("th-TH", {
    month: "short",
    year: "2-digit",
  });
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`ไม่สามารถโหลดข้อมูลสถิติได้ (${response.status})`);
        }

        const json: AnalyticsDashboard = await response.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const monthlySales = useMemo(
    () =>
      (data?.monthlySales ?? []).map((item) => ({
        ...item,
        label: formatMonth(item.month),
      })),
    [data?.monthlySales],
  );

  const maxProductSold = Math.max(
    ...((data?.bestSellingProducts ?? []).map(
      (product) => product.totalSold,
    ) || [0]),
    0,
  );

  const stats = [
    {
      title: "รายได้ทั้งหมด(NET)",
      value: data ? formatCurrency(data.netRevenue) : "-",
      icon: <TrendingUp size={24} />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "จำนวนออเดอร์",
      value: data ? data.totalOrders.toLocaleString("th-TH") : "-",
      icon: <ShoppingCart size={24} />,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "ค่าเฉลี่ยต่อออเดอร์",
      value: data ? formatCurrency(data.averageOrderValue) : "-",
      icon: <BarChart3 size={24} />,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "ลูกค้าใหม่",
      value: data ? data.newCustomers.toLocaleString("th-TH") : "-",
      icon: <Users size={24} />,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4 -mx-6 -mt-6 bg-white border-b border-gray-200 px-6 py-4 lg:px-8">
        <div>
          <h1 className="text-4xl font-bold text-[#4E0707] mb-2">
            สถิติและการวิเคราะห์
          </h1>
          <p className="text-gray-500">ดูข้อมูลการขายและประสิทธิภาพของระบบ</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  {stat.title}
                </p>
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            ยอดขายรายเดือน
          </h2>
          <div className="h-64">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-lg bg-muted" />
            ) : monthlySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(value) =>
                      Number(value).toLocaleString("th-TH")
                    }
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `เดือน ${label}`}
                  />
                  <Bar
                    dataKey="totalSales"
                    fill="#4E0707"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center rounded-lg bg-accent/5 text-sm text-muted-foreground">
                ยังไม่มีข้อมูลยอดขายรายเดือน
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            สินค้าที่ขายดีที่สุด
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : data && data.bestSellingProducts.length > 0 ? (
            <div className="space-y-4">
              {data.bestSellingProducts.map((product) => {
                const percent =
                  maxProductSold > 0
                    ? Math.round((product.totalSold / maxProductSold) * 100)
                    : 0;

                return (
                  <div key={product.id}>
                    <div className="flex justify-between gap-4 mb-1">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {product.name ?? `สินค้า #${product.id}`}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {product.store?.name ?? "ไม่พบข้อมูลร้าน"}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        <p>{product.totalSold.toLocaleString("th-TH")} ชิ้น</p>
                        <p>{formatCurrency(product.totalSales)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              ยังไม่มีข้อมูลสินค้าขายดี
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
