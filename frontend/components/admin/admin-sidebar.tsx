"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  LogOut,
  Menu,
  Package,
  Store,
  Users,
  X,
} from "lucide-react";

import { AdminMenuItem } from "@/types/admin";

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems: AdminMenuItem[] = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/admin",
    }, {
      icon: <Package size={20} />,
      label: "จัดการสินค้า",
      href: "/admin/products",
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

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="border-b border-[#B4915B] p-4 lg:p-6">
        <h1 className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-white">
          <Package size={28} className="text-[#B4915B]" />
          SmartButcher
        </h1>
        <p className="mt-1 text-xs lg:text-sm text-gray-300">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
        <ul className="space-y-1 lg:space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 lg:px-4 lg:py-3 text-sm lg:text-base transition-colors ${active
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
      <div className="space-y-2 border-t border-[#B4915B] p-3 lg:p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 lg:px-4 lg:py-3 text-sm lg:text-base text-red-300 transition-colors hover:bg-red-900/50 text-left"
        >
          <LogOut size={20} />
          <span className="font-medium">ออกจากระบบ</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 lg:hidden rounded-lg bg-[#4E0707] p-2 text-white shadow-lg hover:bg-[#6B0909] transition-colors"
        aria-label="เปิดเมนู"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-[#4E0707] text-white shadow-lg transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 rounded-lg p-1 text-gray-300 hover:text-white hover:bg-[#6B0909] transition-colors"
          aria-label="ปิดเมนู"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar — always visible */}
      <aside className="sticky top-0 hidden lg:flex h-screen w-64 shrink-0 flex-col bg-[#4E0707] text-white shadow-lg">
        {sidebarContent}
      </aside>
    </>
  );
}
