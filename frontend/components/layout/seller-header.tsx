"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { fetchApi } from "@/lib/api";

/** แมปเส้นทาง URL ไปยังชื่อหน้าและคำอธิบายภาษาไทย */
const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/seller": {
    title: "Dashboard",
    subtitle: "ภาพรวมยอดขาย รายรับ และสถิติร้านค้าของคุณ",
  },
  "/seller/products": {
    title: "My Products",
    subtitle: "จัดการสินค้า เพิ่ม แก้ไข หรือลบสินค้าในร้าน",
  },
  "/seller/orders": {
    title: "Orders",
    subtitle: "ติดตามและจัดการคำสั่งซื้อจากลูกค้า",
  },
  "/seller/profile": {
    title: "โปรไฟล์ร้านค้า",
    subtitle: "แก้ไขข้อมูลร้านและการตั้งค่าบัญชีผู้ขาย",
  },
};

interface SellerHeaderProps {
  onMenuClick?: () => void;
}

export default function SellerHeader({ onMenuClick }: SellerHeaderProps) {
  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // หาข้อมูล title/subtitle จาก pathname (exact match ก่อน, fallback ถ้าไม่เจอ)
  const pageMeta = PAGE_META[pathname] ?? {
    title: "Seller Hub",
    subtitle: "ระบบจัดการร้านค้า Smart Butcher",
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchApi(`/auth/me`, {
          method: "GET",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            ...userData,
            avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=${userData.email || "seller"}`,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetchApi(`/auth/logout`, {
        method: "POST",
      });
    } catch (e) {}
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3 py-2.5 shadow-xs lg:px-8 lg:py-4">
      <div className="flex items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Button: กลมกลืนไปกับ Header ไม่ลอย */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-[#4E0707] hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none cursor-pointer"
            aria-label="เปิดเมนู"
          >
            <Menu size={22} />
          </button>

          {/* Dynamic Page Title + Subtitle (ใช้ pageMeta จาก pathname) */}
          <div className="hidden sm:flex flex-col min-w-0">
            <h2 className="truncate text-base sm:text-lg lg:text-xl font-bold text-[#4E0707] leading-tight">
              {pageMeta.title}
            </h2>
            <p className="hidden lg:block truncate text-xs text-gray-400 leading-tight mt-0.5">
              {pageMeta.subtitle}
            </p>
          </div>

          {/* Mobile: แสดงแค่ชื่อหน้าสั้นๆ (sm ลงมา) */}
          <span className="sm:hidden text-sm font-bold text-[#4E0707] truncate">
            {pageMeta.title}
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Notification Button */}
          <button
            type="button"
            className="relative p-2 text-gray-500 hover:text-[#4E0707] hover:bg-gray-100 rounded-full transition-colors focus:outline-none cursor-pointer"
            aria-label="การแจ้งเตือน"
          >
            <Bell size={20} />
            {/* Notification Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B4915B] rounded-full ring-2 ring-white"></span>
          </button>

          {/* Profile Dropdown (Hover / Focus-within) */}
          <div className="relative group" tabIndex={0}>
            <button
              type="button"
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#B4915B]/40 transition-all focus:outline-none cursor-pointer"
            >
              <img
                src={
                  user?.avatarUrl ||
                  "https://api.dicebear.com/9.x/adventurer/svg?seed=seller"
                }
                alt={user?.fullName || "seller"}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
              />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 invisible group-hover:visible group-focus-within:visible opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 border border-gray-100">
              {isLoading ? (
                <div className="px-4 py-2 text-sm text-[#4E0707]/70">
                  กำลังตรวจสอบบัญชี...
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-gray-100 mb-1 flex justify-between items-center">
                    <div className="flex flex-col min-w-0 pr-2">
                      <p className="text-xs text-[#4E0707]/70">ผู้ขาย</p>
                      <p className="text-sm font-bold text-[#4E0707] truncate">
                        {user?.fullName || "ผู้ใช้งาน"}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#B4915B]/20 flex items-center justify-center border border-[#B4915B]/30 overflow-hidden shrink-0">
                      <img
                        src={
                          user?.avatarUrl ||
                          "https://api.dicebear.com/9.x/adventurer/svg?seed=seller"
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors font-medium"
                  >
                    หน้าร้านค้า (Marketplace)
                  </Link>

                  <Link
                    href="/seller/profile"
                    className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors"
                  >
                    ข้อมูลร้านค้า (Store Profile)
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors"
                  >
                    โปรไฟล์ส่วนตัว
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100"
                  >
                    ออกจากระบบ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
