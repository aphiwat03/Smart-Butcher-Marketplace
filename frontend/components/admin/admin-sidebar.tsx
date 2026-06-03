"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Verified,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  submenu?: MenuItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

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
      icon: <Verified size={20} />,
      label: "คำสั่งซื้อ",
      href: "/admin/orders",
    },
    {
      icon: <Settings size={20} />,
      label: "ตั้งค่า",
      href: "/admin/settings",
    },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Package size={28} />
          SmartButcher
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedMenu(
                        expandedMenu === item.label ? null : item.label,
                      )
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent/10 transition-colors group"
                  >
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMenu === item.label && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-border">
                      {item.submenu.map((subitem, subindex) => (
                        <li key={subindex}>
                          <Link
                            href={subitem.href!}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                              isActive(subitem.href)
                                ? "bg-primary/10 text-primary font-medium"
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent/10"
                  }`}
                >
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent/10 transition-colors group"
        >
          <Settings
            size={20}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
          <span>ตั้งค่าบัญชี</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors group">
          <LogOut size={20} className="text-destructive" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
