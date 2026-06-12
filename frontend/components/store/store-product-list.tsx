"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string | null;
  badge: string | null;
};

const CATEGORIES = ["ทั้งหมด", "สเต็ก", "วากิว", "ดรายเอจ", "ชาบู"];

export function StoreProductList({
  products,
  storeName,
}: {
  products: Product[];
  storeName: string;
}) {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#4E0707]">
          สินค้าทั้งหมด{" "}
          <span className="text-sm font-normal text-gray-400">
            ({products.length} รายการ)
          </span>
        </h2>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#4E0707] text-white border-[#4E0707]"
                  : "border-gray-200 text-gray-500 hover:border-[#B4915B]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop?q=${encodeURIComponent(product.name)}`}
            className="group border border-gray-200 rounded-xl overflow-hidden hover:border-[#B4915B] hover:shadow-md transition-all bg-white"
          >
            <div className="relative aspect-square bg-gray-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                  🥩
                </div>
              )}
              {product.badge && (
                <span className="absolute top-2 left-2 bg-[#4E0707] text-white text-[10px] px-2 py-0.5 rounded">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="font-medium text-sm text-gray-800 leading-snug mb-1">
                {product.name}
              </p>
              <p className="text-[#4E0707] font-bold">
                ฿{product.price.toLocaleString()}
                <span className="text-gray-400 font-normal text-xs ml-1">
                  /{product.unit}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
