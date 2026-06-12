"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, MoveLeft } from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl: string | null;
  store: string;
  category: string;
};

const MOCK_CART: CartItem[] = [
  {
    id: 1,
    name: "เนื้อวากิวสันนอก",
    price: 899,
    quantity: 2,
    unit: "200g",
    imageUrl: null,
    store: "Smart Butcher Premium",
    category: "วากิว",
  },
  {
    id: 2,
    name: "สเต็กสันใน",
    price: 799,
    quantity: 1,
    unit: "200g",
    imageUrl: null,
    store: "Smart Butcher Premium",
    category: "สเต็ก",
  },
  {
    id: 3,
    name: "เนื้อสไลซ์ชาบู",
    price: 449,
    quantity: 3,
    unit: "300g",
    imageUrl: null,
    store: "Smart Butcher Premium",
    category: "ชาบู",
  },
];

function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) {
  const total = item.price * item.quantity;

  return (
    <div className="grid grid-cols-[80px_1fr_140px_120px_120px_48px] items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* รูปสินค้า */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-3xl">🥩</span>
        )}
      </div>

      {/* ชื่อและร้าน */}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-xs text-[#B4915B] font-semibold">{item.category}</p>
        <Link
          href={`/product/${item.id}`}
          className="font-bold text-[#4E0707] hover:underline leading-snug line-clamp-2"
        >
          {item.name}
        </Link>
        <p className="text-xs text-gray-400">{item.store}</p>
      </div>

      {/* ราคาต่อหน่วย */}
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">
          ฿{item.price.toLocaleString()}
          <span className="text-xs text-gray-400 font-normal ml-1">
            /{item.unit}
          </span>
        </p>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#4E0707] hover:text-[#4E0707] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="w-8 text-center font-bold text-[#4E0707]">
          {item.quantity}
        </span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#4E0707] hover:text-[#4E0707] transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Total */}
      <div className="text-right">
        <p className="font-bold text-[#4E0707]">฿{total.toLocaleString()}</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <ShoppingBag size={48} className="text-gray-200" />
      <p className="text-xl font-bold text-gray-300">ตะกร้าของคุณว่างเปล่า</p>
      <p className="text-sm text-gray-400">
        เพิ่มสินค้าที่ต้องการแล้วกลับมาที่นี่
      </p>
      <Link
        href="/shop"
        className="mt-2 bg-[#4E0707] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#3D0505] transition-colors"
      >
        เลือกซื้อสินค้า
      </Link>
    </div>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART);

  const handleQuantityChange = (id: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
    );
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/shop"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#4E0707] transition-colors"
        >
          <MoveLeft size={16} />
          ช้อปต่อ
        </Link>
        <span className="text-gray-200">|</span>
        <h1 className="text-2xl font-bold text-[#4E0707]">
          ตะกร้าสินค้า
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({itemCount} ชิ้น)
            </span>
          )}
        </h1>
      </div>

      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white px-6">
              {/* Table header */}
              <div className="grid grid-cols-[80px_1fr_140px_120px_120px_48px] gap-4 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <div />
                <div>สินค้า</div>
                <div className="text-center">ราคา</div>
                <div className="text-center">จำนวน</div>
                <div className="text-right">รวม</div>
                <div />
              </div>

              {/* Rows */}
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4 sticky top-24">
              <h2 className="text-lg font-bold text-[#4E0707] border-b border-gray-100 pb-3">
                สรุปคำสั่งซื้อ
              </h2>

              <div className="flex flex-col gap-2.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>ราคาสินค้า ({itemCount} ชิ้น)</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-green-600 font-medium">ฟรี</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-700">ยอดรวมทั้งหมด</span>
                <span className="text-xl font-bold text-[#4E0707]">
                  ฿{subtotal.toLocaleString()}
                </span>
              </div>

              <button className="w-full bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3 rounded-xl transition-colors mt-1">
                สั่งซื้อ
              </button>

              <Link
                href="/shop"
                className="text-center text-sm text-gray-400 hover:text-[#4E0707] transition-colors"
              >
                ช้อปต่อ
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
