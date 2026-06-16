"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function SiteHeader() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<{
    fullName: string;
    avatarUrl?: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const cartCount = useCartStore((e) => e.cartCount);
  const fetchCartCount = useCartStore((e) => e.fetchCartCount);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      setToken(storedToken);

      if (!storedToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            ...userData,
            name: userData.fullName,
            avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mason", // คงรูปเดิม
          });
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

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);
  const isLoggedIn = !!user;
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keyword = searchTerm.trim();
    router.push(keyword ? `/shop?q=${encodeURIComponent(keyword)}` : "/shop");
  };

  return (
    <header className="bg-[#4E0707] text-white sticky top-0 z-50 shadow-lg ">
      <nav className="relative max-w-7xl mx-auto flex justify-between items-center px-6 py-4 ">
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-8">
          <Link
            href="/"
            className="hover:text-[#B4915B] transition-colors font-medium"
          >
            HOME
          </Link>

          {/* SHOP Menu with Categories Dropdown */}
          <div className="relative group/shop py-2">
            <button className="flex items-center space-x-1 hover:text-[#B4915B] transition-colors font-medium cursor-pointer">
              <span>SHOP</span>
              <svg
                className="w-4 h-4 transition-transform group-hover/shop:rotate-180 duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Items */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-52 bg-white rounded-lg shadow-xl py-2 z-50 invisible group-hover/shop:visible opacity-0 group-hover/shop:opacity-100 transition-all duration-200 border border-gray-100">
              {[
                { name: "เนื้อสำหรับสเต็ก", slug: "เนื้อสำหรับสเต็ก" },
                { name: "เนื้อวากิวคัดพิเศษ", slug: "เนื้อวากิวคัดพิเศษ" },
                { name: "เนื้อดรายเอจ", slug: "เนื้อดรายเอจ" },
                { name: "เนื้อแปรรูป", slug: "เนื้อแปรรูป" },
                { name: "เนื้อบด", slug: "เนื้อบด" },
                {
                  name: "เนื้อสไลซ์ชาบู / ปิ้งย่าง",
                  slug: "เนื้อสไลซ์ชาบู / ปิ้งย่าง",
                },
              ].map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop?category=${category.slug}`}
                  className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="hover:text-[#B4915B] transition-colors font-medium"
          >
            CONTACT US
          </Link>
        </div>

        {/* Right: Search, Profile, Cart */}
        <div className="flex items-center justify-end space-x-4 sm:min-w-[18rem]">
          <form
            onSubmit={handleSearch}
            className="relative hidden sm:block w-full max-w-[15rem]"
          >
            {" "}
            {/* ใช้ max-w เพื่อคุมความยาว */}
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="h-10 w-full rounded-lg bg-white/10 px-4 py-2 pr-10 text-white placeholder-gray-300 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-[#B4915B] [&::-webkit-search-cancel-button]:appearance-none transition-all"
            />
            <button
              type="submit"
              aria-label="Search products"
              className="absolute right-3 top-2.5 text-white hover:text-[#B4915B]"
            >
              <Search size={18} />
            </button>
          </form>

          <Link
            href="/cart"
            className="hover:text-[#B4915B] transition-colors p-2 relative"
          >
            <ShoppingCart size={20} />
            {token && (
              <span className="absolute top-0 right-0 bg-[#B4915B] text-[#4E0707] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="relative group">
            <button className="hover:text-[#B4915B] transition-colors p-2 flex items-center">
              <User size={20} />
            </button>

            <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-xl py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-100">
              {isLoading ? (
                <div className="px-4 py-2 text-sm text-[#4E0707]/70">
                  Checking account...
                </div>
              ) : !isLoggedIn ? (
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-[#4E0707] hover:bg-gray-100 hover:text-[#B4915B] transition-colors font-medium"
                >
                  เข้าสู่ระบบ / สมัครสมาชิก
                </Link>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-gray-100 mb-1 flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-xs text-[#4E0707]/70">สวัสดีคุณ</p>
                      <p className="text-sm font-bold text-[#4E0707] truncate max-w-[100px]">
                        {user?.fullName}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#B4915B]/20 flex items-center justify-center border border-[#B4915B]/30 overflow-hidden">
                      <img
                        src={user?.avatarUrl}
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
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      setUser(null);
                      setToken(null);
                      router.push("/");
                    }}
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
