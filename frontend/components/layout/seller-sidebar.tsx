"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  LogOut,
} from "lucide-react";

export default function SellerSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/seller",
      icon: LayoutDashboard,
    },
    {
      name: "My Products",
      href: "/seller/products",
      icon: Package,
    },
    {
      name: "My Orders",
      href: "/seller/orders",
      icon: ShoppingCart,
    },
    {
      name: "Profile",
      href: "/seller/profile",
      icon: User,
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 bg-[#4E0707] text-white shadow-lg flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-[#B4915B]">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" />
          Seller Hub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-[#B4915B] text-white"
                  : "text-gray-200 hover:bg-[#6B0909]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#B4915B]">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-[#6B0909] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
