"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { Star, ChevronLeft, ChevronRight, Beef } from "lucide-react";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const fallbackTestimonials = [
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

  const categoryFallbackImages = [
    "mock/category/พรีเมียมสเต็ก.jpg",
    "mock/category/วากิวคัดพิเศษ.webp",
    "mock/category/ดรายเอจ.jpg",
    "mock/category/เนื้อคัดพิเศษ.jpg",
    "mock/category/เนื้อบด.jpg",
    "mock/category/ชุดอุปกรณ์.jpeg",
  ];

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("snap-y", "snap-mandatory");
    return () => {
      document.documentElement.classList.remove("snap-y", "snap-mandatory");
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, revRes] = await Promise.all([
          fetch(`${API_URL}/users/products/categories`),
          fetch(`${API_URL}/users/products`),
          fetch(`${API_URL}/reviews`),
        ]);

        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(cats);
        }

        if (prodRes.ok) {
          const prods = await prodRes.json();
          setProducts(Array.isArray(prods) ? prods : (prods.data || []));
        }

        if (revRes.ok) {
          const revs = await revRes.json();
          const mappedRevs = revs.map((r: any) => ({
            id: r.id,
            name: r.user.fullName,
            rating: r.point,
            comment: r.description,
            image: `https://api.dicebear.com/9.x/adventurer/svg?seed=${r.user.fullName}`,
            alt: "avatar",
          }));
          if (mappedRevs.length > 0) {
            setTestimonials(mappedRevs);
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing page data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      {/* 1. HERO SECTION */}
      <section
        className="snap-start relative min-h-screen w-full flex items-center justify-center pt-20 text-center text-white bg-cover bg-center bg-fixed overflow-hidden"
        style={{
          backgroundImage: 'url("/picture/hero-bg.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0a]/80 via-black/50 to-[#1a0a0a]/90 z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 md:px-12 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-2xl">
            ยกระดับมื้อพิเศษของคุณด้วย <br className="hidden md:block" />
            <span className="text-[#B4915B]">เนื้อคุณภาพพรีเมียม</span>
          </h1>

          <p className="text-base md:text-xl lg:text-2xl mb-10 text-gray-200 max-w-2xl font-light drop-shadow-md">
            แหล่งรวมร้านเนื้อชั้นนำ การันตีคุณภาพและความสดใหม่
            ส่งตรงจากฟาร์มถึงหน้าบ้านคุณ
          </p>

          <Link
            href="/shop"
            className="group relative overflow-hidden bg-[#B4915B] hover:bg-[#9A7A48] text-white px-8 py-4 md:px-10 md:py-4 rounded-full font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(180,145,91,0.4)] hover:shadow-[0_0_30px_rgba(180,145,91,0.6)] cursor-pointer flex items-center gap-2"
          >
            <span>เริ่มต้นช้อปเลย</span>
            <ChevronRight
              className="w-6 h-6 group-hover:translate-x-1 transition-transform"
              strokeWidth={3}
            />
          </Link>
        </div>
      </section>

      {/* 2. OUR Category SECTION */}
      <section
        id="categories"
        className="snap-start scroll-mt-16 py-10 px-4 md:py-16 md:px-6 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-[#4E0707]">
            Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {categories.slice(0, 6).map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="block relative w-full sm:w-80 overflow-hidden hover:shadow-xl transition-shadow group border border-gray-200 rounded-xl bg-white"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={
                      categoryFallbackImages[
                      index % categoryFallbackImages.length
                      ]
                    }
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

      {/* 3. TEXT SECTION */}
      <section
        id="Promotion"
        className="snap-start scroll-mt-16 py-10 px-4 md:py-16 md:px-6 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#4E0707] mb-4 md:mb-8">
                ศูนย์รวมร้านเนื้อคุณภาพชั้นนำ
              </h2>
              <ul className="space-y-6 text-gray-700">
                <li className="flex items-start space-x-4">
                  <span className="text-[#B4915B] font-bold text-2xl leading-none">
                    •
                  </span>
                  <div>
                    <h3 className="font-bold text-[#4E0707] mb-1">
                      การันตีสินค้าดีทุกชิ้น
                    </h3>
                    <p>
                      เราคัดกรองร้านค้าและตรวจสอบคุณภาพสินค้าอย่างเข้มงวด
                      เพื่อให้คุณมั่นใจว่าได้รับเนื้อเกรดพรีเมียมที่ตรงปกและดีที่สุดเสมอ
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <span className="text-[#B4915B] font-bold text-2xl leading-none">
                    •
                  </span>
                  <div>
                    <h3 className="font-bold text-[#4E0707] mb-1">
                      หลากหลายร้านค้าในที่เดียว
                    </h3>
                    <p>
                      รวบรวมเนื้อวากิวและเนื้อคุณภาพเยี่ยมจากฟาร์มและร้านเนื้อชั้นนำทั่วประเทศ
                      ให้คุณเลือกเปรียบเทียบและสั่งซื้อได้ครบจบในแพลตฟอร์มเดียว
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

      {/* 4. Comment SECTION */}
      <section
        id="Testimonials"
        className="snap-start scroll-mt-16 py-10 px-4 md:py-16 md:px-6 bg-[#E1E1E1]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-[#4E0707]">
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

            <div className="flex-1 mx-2 md:mx-6 bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm md:text-lg text-[#4E0707]">
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
              <p className="text-gray-700 text-sm md:text-lg italic">
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
                className={`h-3 rounded-full transition-all ${index === currentTestimonial
                    ? "w-8 bg-[#4E0707]"
                    : "w-3 bg-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR PRODUCTS SECTION */}
      <section id="products" className="snap-start scroll-mt-16 py-10 px-4 md:py-16 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-[#4E0707]">
            Popular Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="block relative w-full sm:w-80 overflow-hidden hover:shadow-xl transition-shadow group border border-gray-200 rounded-xl bg-white"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <img
                    src={product.imageUrl || "mock/beef/วากิว.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-[#4E0707] mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-[#B4915B] font-semibold">
                      ฿{product.price}
                    </p>
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
