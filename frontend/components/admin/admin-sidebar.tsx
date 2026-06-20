"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, LogOut, Package, Store, Users } from "lucide-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: <Store size={20} />,
      label: "จัดการร้านค้า",
      href: "/admin/stores",
    },
    {
      icon: <Users size={20} />,
      label: "ผู้ใช้งานทั้งหมด",
      href: "/admin/users",
    },
    {
      icon: <Package size={20} />,
      label: "ตรวจสอบคำสั่งซื้อ",
      href: "/admin/orders",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "สถิติและรายได้",
      href: "/admin/analytics",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#4E0707] text-white shadow-lg">
      {/* Brand Header */}
      <div className="border-b border-[#B4915B] p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Package size={28} className="text-[#B4915B]" />
          SmartButcher
        </h1>
        <p className="mt-1 text-sm text-gray-300">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    active
                      ? "bg-[#B4915B] font-medium text-white"
                      : "text-gray-200 hover:bg-[#6B0909]"
                  }`}
                >
                  <span className={active ? "text-white" : "text-gray-200"}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="space-y-2 border-t border-[#B4915B] p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 cursor-pointer rounded-lg px-4 py-3 text-red-300 transition-colors hover:bg-red-900/50 text-left"
        >
          <LogOut size={20} />
          <span className="font-medium">ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
