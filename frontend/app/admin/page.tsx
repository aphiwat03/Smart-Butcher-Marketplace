import { BarChart3, Package, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "ทั้งหมด",
      value: "1,245",
      icon: <Package size={24} />,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "ขายได้เดือนนี้",
      value: "892",
      icon: <TrendingUp size={24} />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "รอการอนุมัติ",
      value: "45",
      icon: <BarChart3 size={24} />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "สมาชิก",
      value: "3,521",
      icon: <Users size={24} />,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          ยินดีต้อนรับเข้าสู่ระบบจัดการสินค้า
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            กิจกรรมล่าสุด
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div>
                  <p className="font-medium text-foreground">
                    สินค้า{item}ถูกอัพเดต
                  </p>
                  <p className="text-sm text-muted-foreground">
                    เมื่อ {(Math.random() * 24) | 0} ชั่วโมงที่แล้ว
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-xs font-medium rounded-full">
                  สำเร็จ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            สถานะปัจจุบัน
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  ใช้พื้นที่เก็บข้อมูล
                </span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  ประสิทธิภาพเซิร์ฟเวอร์
                </span>
                <span className="text-sm text-muted-foreground">82%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: "82%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  ความพึงพอใจผู้ใช้
                </span>
                <span className="text-sm text-muted-foreground">94%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
