"use client";

import { BarChart3, TrendingUp, Users, ShoppingCart } from "lucide-react";

export default function AnalyticsPage() {
  const chartData = [
    { month: "ม.ค.", sales: 4000, orders: 240 },
    { month: "ก.พ.", sales: 3000, orders: 221 },
    { month: "มี.ค.", sales: 2000, orders: 229 },
    { month: "เม.ย.", sales: 2780, orders: 200 },
    { month: "พ.ค.", sales: 1890, orders: 229 },
    { month: "มิ.ย.", sales: 2390, orders: 200 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          สถิติและการวิเคราะห์
        </h1>
        <p className="text-muted-foreground">
          ดูข้อมูลการขายและประสิทธิภาพของระบบ
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">
                ยอดขายทั้งหมด
              </p>
              <p className="text-3xl font-bold text-foreground">฿245,320</p>
              <p className="text-xs text-green-500 mt-2">
                ↑ 12% จากเดือนที่แล้ว
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <TrendingUp size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">จำนวนออเดอร์</p>
              <p className="text-3xl font-bold text-foreground">1,289</p>
              <p className="text-xs text-green-500 mt-2">
                ↑ 8% จากเดือนที่แล้ว
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <ShoppingCart size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">
                ค่าเฉลี่ยต่อออเดอร์
              </p>
              <p className="text-3xl font-bold text-foreground">฿190</p>
              <p className="text-xs text-muted-foreground mt-2">
                ไม่มีการเปลี่ยนแปลง
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
              <BarChart3 size={24} className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">ลูกค้าใหม่</p>
              <p className="text-3xl font-bold text-foreground">342</p>
              <p className="text-xs text-green-500 mt-2">
                ↑ 15% จากเดือนที่แล้ว
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg">
              <Users size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            ยอดขายรายเดือน
          </h2>
          <div className="h-64 flex items-center justify-center bg-accent/5 rounded-lg">
            <p className="text-muted-foreground">[กราฟจะแสดงที่นี่]</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            สินค้าที่ขายดีที่สุด
          </h2>
          <div className="space-y-3">
            {[
              { name: "เนื้อวากิวพรีเมียม", sales: 324, percent: 45 },
              { name: "เนื้อเบียร์พรีเมียม", sales: 245, percent: 35 },
              { name: "เนื้อหมูไร้กระดูก", sales: 187, percent: 20 },
            ].map((product) => (
              <div key={product.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {product.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {product.sales} ชิ้น
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${product.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
