"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User } from "lucide-react";

export function SiteHeader() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<unknown>(null);
  const router = useRouter();

  const mockUser = {
    name: "Aphiwat Phankham.",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mason",
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("accessToken");
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

  const isLoggedIn = !!user;

  if (isLoading) return null;

  return (
    <header className="bg-[#4E0707] text-white sticky top-0 z-50 shadow-lg ">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 ">
        {/* Left: Logo */}
        <div className="flex-shrink-0 ">
          <Image
            src="/svg/logo.svg"
            alt="Smart Butcher Logo"
            width={33.61}
            height={33.61}
            className="rounded-md"
          />
        </div>

        {/* Center: Navigation Menu */}
        <div className="flex items-center space-x-8">
          <Link href="#" className="hover:text-[#B4915B] transition-colors">
            MEAT
          </Link>
          <Link href="#" className="hover:text-[#B4915B] transition-colors">
            DEAL
          </Link>
          <Link href="#" className="hover:text-[#B4915B] transition-colors">
            BUTCHER AI
          </Link>
          <Link href="#" className="hover:text-[#B4915B] transition-colors">
            CONTACT US
          </Link>
        </div>

        {/* Right: Search, Profile, Cart */}
        <div className="flex items-center space-x-4">
          {/* Search Bar เดิมของคุณ */}
          <div className="relative hidden sm:block group">
            <input
              type="text"
              placeholder="Search..."
              className="w-10 h-10 px-4 py-2 bg-transparent text-transparent placeholder-transparent cursor-pointer rounded-lg transition-all duration-300 ease-out focus:w-64 focus:bg-white/10 focus:text-white focus:placeholder-gray-300 focus:cursor-text focus:outline-none focus:ring-2 focus:ring-[#B4915B] pr-10"
            />
            <Search
              size={18}
              className="absolute right-3 top-2.5 text-white transition-colors duration-200 group-hover:text-[#B4915B] group-focus-within:text-[#B4915B] pointer-events-none"
            />
          </div>

          {/* Shopping Cart เดิมของคุณ */}
          <button className="hover:text-[#B4915B] transition-colors p-2 relative">
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 bg-[#B4915B] text-[#4E0707] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              0
            </span>
          </button>

          {/* ส่วน User Dropdown ใหม่ */}
          <div className="relative group">
            <button className="hover:text-[#B4915B] transition-colors p-2 flex items-center">
              <User size={20} />
            </button>

            {/* เมนู Dropdown: จะปรากฏเมื่อ Hover ที่ group */}
            <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-xl py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-100">
              {!isLoggedIn ? (
                // case: ยังไม่ได้เข้าสู่ระบบ
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors font-medium"
                >
                  เข้าสู่ระบบ / สมัครสมาชิก
                </Link>
              ) : (
                // case: เข้าสู่ระบบแล้ว
                <>
                  <div className="px-4 py-3 border-b border-gray-100 mb-1 flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-xs text-[#4E0707]/70">สวัสดีคุณ</p>
                      <p className="text-sm font-bold text-[#4E0707] truncate max-w-[100px]">
                        {mockUser.name}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#B4915B]/20 flex items-center justify-center border border-[#B4915B]/30 overflow-hidden">
                      <img
                        src={mockUser.avatarUrl}
                        alt="User Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors"
                  >
                    โปรไฟล์ของคุณ
                  </Link>

                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors"
                  >
                    รายการคำสั่งซื้อ
                  </Link>

                  <button
                    onClick={() => router.push("/login")}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100"
                  >
                    ออกจากระบบ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
