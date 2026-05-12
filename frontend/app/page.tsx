"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  Star,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Beef,
} from "lucide-react";
import { FacebookIcon } from "@/components/ui/facebook-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "สมชาย สุดหล่อ",
      rating: 5,
      comment: "เนื้อสดใหม่และคุณภาพสูง ส่งมาเร็ว ต้องขอบคุณมากค่ะ",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sadie",
      alt: "avatar",
    },
    {
      id: 2,
      name: "ศรีลักษณ์ ใจดี",
      rating: 5,
      comment: "บริการยอดเยี่ยม เนื้อเนียนนุ่ม ของใจไปเลยค่ะ",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Oliver",
      alt: "avatar",
    },
    {
      id: 3,
      name: "ปิยะ อ่อนมาก",
      rating: 4,
      comment: "คุณภาพดี ราคาเหมาะสม แนะนำเพื่อนเยอะแล้ว",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Emery",
      alt: "avatar",
    },
    {
      id: 4,
      name: "เอกพล สายเนื้อ",
      rating: 5,
      comment: "วากิวลายหินอ่อนสวยมาก ย่างแล้วละลายในปากเลยครับ สั่งอีกแน่นอน",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix",
      alt: "avatar",
    },
    {
      id: 5,
      name: "นฤมล คนหิว",
      rating: 5,
      comment:
        "แพ็คเกจจิ้งดูดีมาก เก็บความเย็นได้เยี่ยม เนื้อไม่มีกลิ่นคาวเลยค่ะ",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Avery",
      alt: "avatar",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "พรีเมียมสเต็ก",
      image: "mock/category/พรีเมียมสเต็ก.jpg",
    },
    {
      id: 2,
      name: "เนื้อชาบู",
      image: "mock/category/เนื้อชาบู.jpg",
    },
    {
      id: 3,
      name: "เนื้อบด",
      image: "mock/category/เนื้อบด.jpg",
    },
    {
      id: 4,
      name: "เนื้อคัดพิเศษ",
      image: "mock/category/เนื้อคัดพิเศษ.jpg",
    },
    {
      id: 5,
      name: "เนื้อดรายเอจ",
      image: "mock/category/ดรายเอจ.jpg",
    },
    {
      id: 6,
      name: "เนื้อวากิวคัดพิเศษ",
      image: "mock/category/วากิวคัดพิเศษ.webp",
    },
  ];

  const products = [
    {
      id: 1,
      name: "เนื้อวากิว",
      price: "฿899",
      image: "mock/beef/วากิว.jpg",
    },
    {
      id: 2,
      name: "เนื้อท้องสันนอก",
      price: "฿599",
      image: "mock/beef/ท้องสันนอก.png",
    },
    {
      id: 3,
      name: "เนื้อสันนอก",
      price: "฿699",
      image: "mock/beef/เนื้อสันนอก.webp",
    },
    {
      id: 4,
      name: "เนื้อสันใน",
      price: "฿799",
      image: "mock/beef/สันใน.jpeg",
    },
    {
      id: 5,
      name: "เนื้อบด",
      price: "฿399",
      image: "mock/beef/เนื้อบด.webp",
    },
    {
      id: 6,
      name: "เนื้อนวล",
      price: "฿449",
      image: "mock/beef/เนื้อนวล.jpg",
    },
    {
      id: 7,
      name: "เนื้อสันหนัง",
      price: "฿349",
      image: "mock/beef/เนื้อสันหนัง.png",
    },
    {
      id: 8,
      name: "เนื้อโครงหลัง",
      price: "฿299",
      image: "mock/beef/โครงหลัง.webp",
    },
  ];

  const router = useRouter();

  const isLoggedIn = false; // เปลี่ยนเป็น true เพื่อทดสอบเมนูผู้ใช้เมื่อเข้าสู่ระบบแล้ว

  const mockUser = {
    name: "Aphiwat Phankham.",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mason",
  };
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <main>
      {/* 1. HEADER SECTION */}
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

      {/* 2. HERO SECTION */}
      <section
        className="relative h-150 flex items-center justify-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: 'url("/picture/hero-bg.jpg")',
        }}
      >
        <div className="max-w-2xl mx-auto px-20 bg-white/10 backdrop-blur-md p-20">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Beef className="w-12 h-12 text-[#4E0707]" strokeWidth={2} />
            <h2 className="text-5xl font-extrabold">Meat Excellence</h2>
          </div>
          <p className="text-lg mb-8 text-gray-100">
            คัดสรรเฉพาะเนื้อเกรดดีที่สุดเพื่อมื้อพิเศษของคุณ
          </p>
          <button className="bg-[#B4915B] hover:bg-[#9A7A48] text-white px-10 py-1 rounded-sm font-bold text-lg transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* 3. OUR Category SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#4E0707]">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="block relative w-80 overflow-hidden hover:shadow-xl transition-shadow group border border-gray-200 rounded-xl bg-white"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col items-center justify-center p-4 mt-2">
                  <h3 className="text-lg font-bold text-[#4E0707] text-center transition-colors duration-300 group-hover:text-[#B4915B]">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROMOTION SECTION */}
      <section id="Promotion" className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h2 className="text-4xl font-bold text-[#4E0707] mb-8">
                The Finest Cuts for You
              </h2>
              <ul className="space-y-6 text-gray-700">
                <li className="flex items-start space-x-4">
                  <span className="text-[#B4915B] font-bold text-2xl leading-none">
                    •
                  </span>
                  <div>
                    <h3 className="font-bold text-[#4E0707] mb-1">
                      Hand-Selected Quality
                    </h3>
                    <p>
                      Carefully selected piece by piece from the best grades by
                      experts to ensure quality before it reaches your hands.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <span className="text-[#B4915B] font-bold text-2xl leading-none">
                    •
                  </span>
                  <div>
                    <h3 className="font-bold text-[#4E0707] mb-1">
                      Master Butcher Cuts
                    </h3>
                    <p>
                      Meticulously trimmed according to international standards
                      to maintain the best texture and flavor in every part.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Column */}
            <div>
              <img
                src="mock/beef/beef-fresh.jpg"
                alt="Premium Meat"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="Testimonials" className="py-16 px-6 bg-[#E1E1E1]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#4E0707]">
            What Our Customers Say
          </h2>

          {/* Carousel Container */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevTestimonial}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ChevronLeft size={32} className="text-[#4E0707]" />
            </button>

            {/* Testimonial Card */}
            <div className="flex-1 mx-6 bg-white rounded-lg shadow-lg p-8 max-w-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg text-[#4E0707]">
                    {testimonials[currentTestimonial].name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {Array.from({
                      length: testimonials[currentTestimonial].rating,
                    }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-[#B4915B] fill-[#B4915B]"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg italic">
                "{testimonials[currentTestimonial].comment}"
              </p>
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ChevronRight size={32} className="text-[#4E0707]" />
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentTestimonial
                    ? "w-8 bg-[#4E0707]"
                    : "w-3 bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. POPULAR PRODUCTS SECTION */}
      <section id="products" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#4E0707]">
            Popular Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#4E0707] mb-2">
                    {product.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER SECTION */}
      <footer id="footer" className="bg-[#4E0707] text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Logo */}
          <div className="flex items-center justify-center md:justify-start">
            <Image
              src="/svg/logo.svg"
              alt="Smart Butcher Logo"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>

          {/* Right Column: Contact Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-[#B4915B]" />
              <span>+66 (0) 2-XXX-XXXX</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-[#B4915B]" />
              <span>info@smartbutcher.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#B4915B]">Follow Us:</span>
              <a href="#" className="hover:text-[#B4915B] transition-colors">
                <FacebookIcon className="w-6 h-6 text-blue-600" />
              </a>
              <a href="#" className="hover:text-[#B4915B] transition-colors">
                <InstagramIcon className="w-6 h-6 text-pink-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-[#B4915B] border-opacity-30 py-6">
          <p className="text-center text-white">
            © 2026 Smart Butcher Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
