"use client";

import { useEffect, useState } from "react";
import { BarChart3, Package, TrendingUp, Users } from "lucide-react";
import { API_URL } from "@/lib/api";

interface RecentActivity {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  store: {
    id: number;
    name: string;
  };
}

interface DashboardData {
  totalOrders: number;
  currentMonthSales: number;
  pendingPaymentSlips: number;
  totalUsers: number;
  recentActivities: RecentActivity[];
}

function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "เมื่อสักครู่";
  if (diffMinutes < 60) return `เมื่อ ${diffMinutes} นาทีที่แล้ว`;
  if (diffHours < 24) return `เมื่อ ${diffHours} ชั่วโมงที่แล้ว`;
  return `เมื่อ ${diffDays} วันที่แล้ว`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");

        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`ไม่สามารถโหลดข้อมูล Dashboard ได้ (${res.status})`);
        }

        const json: DashboardData = await res.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "คำสั่งซื้อทั้งหมด",
      value: data ? data.totalOrders.toLocaleString() : "-",
      icon: <Package size={24} />,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "ยอดขายเดือนนี้",
      value: data ? `${data.currentMonthSales.toLocaleString()} บ.` : "-",
      icon: <TrendingUp size={24} />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "สลิปรอการอนุมัติ",
      value: data ? data.pendingPaymentSlips.toLocaleString() : "-",
      icon: <BarChart3 size={24} />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "สมาชิก",
      value: data ? data.totalUsers.toLocaleString() : "-",
      icon: <Users size={24} />,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mx-4 -mt-14 lg:-mx-6 lg:-mt-6 mb-6 md:mb-8 bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4 pt-14 lg:pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#4E0707] mb-1 md:mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500">ยินดีต้อนรับเข้าสู่ระบบจัดการสินค้า</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs md:text-sm mb-1">
                  {stat.title}
                </p>
                {isLoading ? (
                  <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-xl md:text-3xl font-bold text-foreground">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            กิจกรรมล่าสุด
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : data && data.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.store.name} ·{" "}
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-xs font-medium rounded-full whitespace-nowrap">
                    +{activity.amount.toLocaleString()} บ.
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              ยังไม่มีกิจกรรมล่าสุด
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
