"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  submenu?: MenuItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>("products");

  const menuItems: MenuItem[] = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: <Package size={20} />,
      label: "สินค้า",
      submenu: [
        {
          icon: <Package size={18} />,
          label: "รายการสินค้า",
          href: "/admin/products",
        },
        {
          icon: <Package size={18} />,
          label: "เพิ่มสินค้าใหม่",
          href: "/admin/products/new",
        },
      ],
    },
    {
      icon: <BarChart3 size={20} />,
      label: "สถิติ",
      href: "/admin/analytics",
    },
    {
      icon: <ShoppingCart size={20} />,
      label: "คำสั่งซื้อ",
      href: "/admin/orders",
    },
    {
      icon: <Settings size={20} />,
      label: "ตั้งค่า",
      href: "/admin/settings",
    },
  ];

  useEffect(() => {
    if (pathname.startsWith("/admin/products")) {
      setExpandedMenu("products");
    }
  }, [pathname]);

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Package size={28} />
          SmartButcher
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedMenu(
                        expandedMenu === "products" ? null : "products",
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-accent/10"
                  >
                    <span className="text-muted-foreground">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedMenu === "products" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMenu === "products" && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
                      {item.submenu.map((subitem) => (
                        <li key={subitem.href}>
                          <Link
                            href={subitem.href!}
                            className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
                              isActive(subitem.href)
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-foreground hover:bg-accent/10"
                            }`}
                          >
                            <span className="text-muted-foreground">
                              {subitem.icon}
                            </span>
                            <span>{subitem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground hover:bg-accent/10"
                  }`}
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut size={20} />
          <span>ออกจากระบบ</span>
        </Link>
      </div>
    </aside>
  );
}
