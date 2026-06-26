"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";

export default function SellerSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (itemHref: string) => {
    if (itemHref === "/seller") {
      return pathname === "/seller";
    }
    return pathname.startsWith(itemHref);
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
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const sidebarContent = (
    <>
      {/* Logo/Brand */}
      <div className="p-4 lg:p-6 border-b border-[#B4915B]">
        <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
          <Package className="w-7 h-7 lg:w-8 lg:h-8" />
          Seller Hub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg text-sm lg:text-base transition-colors ${active
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

      {/* Action Buttons */}
      <div className="p-3 lg:p-4 border-t border-[#B4915B] space-y-1 lg:space-y-2">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg text-sm lg:text-base text-gray-200 hover:bg-[#6B0909] transition-colors"
        >
          <Store className="w-5 h-5" />
          <span className="font-medium">Marketplace</span>
        </Link>

        <button
          className="w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg text-sm lg:text-base text-red-300 hover:bg-red-900/50 transition-colors text-left"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
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
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-[#4E0707] text-white shadow-lg flex flex-col transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
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
      <aside className="sticky top-0 hidden lg:flex h-screen w-64 shrink-0 bg-[#4E0707] text-white shadow-lg flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
