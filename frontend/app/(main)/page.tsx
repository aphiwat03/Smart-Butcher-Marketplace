"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Beef } from "lucide-react";

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
      name: "เนื้อสำหรับสเต็ก",
      image: "mock/category/พรีเมียมสเต็ก.jpg",
    },
    {
      id: 2,
      name: "เนื้อวากิวคัดพิเศษ",
      image: "mock/category/วากิวคัดพิเศษ.webp",
    },
    {
      id: 3,
      name: "เนื้อดรายเอจ",
      image: "mock/category/ดรายเอจ.jpg",
    },
    {
      id: 4,
      name: "เนื้อแปรรูป",
      image: "mock/category/เนื้อคัดพิเศษ.jpg",
    },
    {
      id: 5,
      name: "เนื้อบด",
      image: "mock/category/เนื้อบด.jpg",
    },
    {
      id: 6,
      name: "เนื้อสไลซ์ชาบู / ปิ้งย่าง",
      image: "mock/category/เนื้อชาบู.jpg",
    },
  ];

  const products = [
    {
      id: 1,
      name: "เนื้อวากิวคัดพิเศษ",
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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const scrollToCategories = () => {
    const target = document.getElementById("categories");

    if (!target) return;

    const headerOffset = 64;
    const startPosition = window.scrollY;
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200;
    let startTime: number | null = null;

    const easeInOutCubic = (progress: number) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const animate = (currentTime: number) => {
      startTime ??= currentTime;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <main>
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
          <button
            type="button"
            onClick={scrollToCategories}
            className="bg-[#B4915B] hover:bg-[#9A7A48] text-white px-10 py-1 rounded-sm font-bold text-lg transition-colors cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* 3. OUR Category SECTION */}
      <section id="categories" className="scroll-mt-24 py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#4E0707]">
            Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
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
                &quot;{testimonials[currentTestimonial].comment}&quot;
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
              <Link
                key={product.id}
                href={`/shop?q=${encodeURIComponent(product.name)}`}
                className="block relative w-80 overflow-hidden hover:shadow-xl transition-shadow group border border-gray-200 rounded-xl bg-white"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
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
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
