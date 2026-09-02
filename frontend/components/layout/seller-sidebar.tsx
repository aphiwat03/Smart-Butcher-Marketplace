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
  ChevronLeft,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

interface SellerSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function SellerSidebar({
  mobileOpen: externalMobileOpen,
  onClose: externalOnClose,
}: SellerSidebarProps = {}) {
  const pathname = usePathname();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mobileOpen = externalMobileOpen ?? internalMobileOpen;
  const setMobileOpen = (open: boolean) => {
    if (!open && externalOnClose) {
      externalOnClose();
    } else {
      setInternalMobileOpen(open);
    }
  };

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

  const handleLogout = async () => {
    try {
      await fetchApi(`/auth/logout`, {
        method: "POST",
      });
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/";
  };

  const renderSidebar = (collapsed: boolean, isMobile: boolean = false) => (
    <>
      <div className="p-3 lg:p-4 border-b border-[#B4915B]/30 flex items-center justify-between">
        {!isMobile ? (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center w-full rounded-xl p-1.5 hover:bg-white/10 transition-all focus:outline-none cursor-pointer group ${
              collapsed ? "justify-center" : "justify-between gap-3"
            }`}
            title={collapsed ? "ขยายแถบเมนู (Expand)" : "หุบแถบเมนู (Collapse)"}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#B4915B] group-hover:scale-105 transition-all shadow-xs">
                <Package className="w-6 h-6 text-white" />
              </div>
              {!collapsed && (
                <h1 className="text-xl font-bold truncate tracking-wide">
                  Seller Hub
                </h1>
              )}
            </div>
            {!collapsed && (
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-[#B4915B] group-hover:-translate-x-0.5 transition-all shrink-0" />
            )}
          </button>
        ) : (
          <div className="flex items-center gap-3 p-1.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold truncate tracking-wide">
              Seller Hub
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm lg:text-base transition-all ${
                collapsed ? "justify-center px-2" : ""
              } ${
                active
                  ? "bg-[#B4915B] text-white shadow-sm font-semibold"
                  : "text-gray-200 hover:bg-[#6B0909] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="font-medium truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="p-3 border-t border-[#B4915B]/30 space-y-1.5">
        <Link
          href="/"
          onClick={() => isMobile && setMobileOpen(false)}
          title={collapsed ? "หน้าร้านค้า (Marketplace)" : undefined}
          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm lg:text-base text-gray-200 hover:bg-[#6B0909] hover:text-white transition-all ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          <Store className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <span className="font-medium truncate">Marketplace</span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          title={collapsed ? "ออกจากระบบ (Logout)" : undefined}
          className={`w-full flex items-center cursor-pointer gap-3 px-3.5 py-3 rounded-xl text-sm lg:text-base text-red-300 hover:bg-red-900/50 hover:text-white transition-all text-left ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium truncate">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-[#4E0707] text-white shadow-lg flex flex-col transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-3 rounded-lg p-1 text-gray-300 hover:text-white hover:bg-[#6B0909] transition-colors cursor-pointer"
          aria-label="ปิดเมนู"
        >
          <X size={20} />
        </button>
        {renderSidebar(false, true)}
      </aside>

      {/* Desktop Sidebar  */}
      <aside
        className={`sticky top-0 hidden lg:flex h-screen shrink-0 bg-[#4E0707] text-white shadow-lg flex-col transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {renderSidebar(isCollapsed, false)}
      </aside>
    </>
  );
}
