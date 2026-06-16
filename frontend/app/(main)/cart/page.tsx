"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Home,
  ShoppingCart,
} from "lucide-react";
import { useCartItems } from "@/hooks/useCartItems";
import { useCartStore } from "@/store/useCartStore";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  store: string;
  category: string;
};

const GRID_COLS = "grid-cols-[80px_1fr_140px_120px_120px_48px]";

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
  const [inputValue, setInputValue] = useState(item.quantity.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1 || newQty === item.quantity) {
      setInputValue(item.quantity.toString());
      return;
    }
    setIsUpdating(true);
    await onQuantityChange(item.id, newQty);
    setIsUpdating(false);
  };

  const handleBlur = () => {
    const newQty = parseInt(inputValue, 10);
    if (isNaN(newQty)) {
      setInputValue(item.quantity.toString());
    } else {
      handleUpdate(newQty);
    }
  };

  return (
    <div
      className={`grid ${GRID_COLS} items-center gap-4 py-4 border-b border-gray-100 last:border-0 overflow-hidden`}
    >
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

      <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
        <p className="text-xs text-[#B4915B] font-semibold truncate">
          {item.category}
        </p>
        <Link
          href={`/product/${item.id}`}
          className="font-bold text-[#4E0707] hover:underline leading-snug line-clamp-2"
        >
          {item.name}
        </Link>
        <p className="text-xs text-gray-400 truncate">{item.store}</p>
      </div>

      {/* Price */}
      <div className="text-center overflow-hidden">
        <p className="text-sm font-semibold text-gray-700 tabular-nums truncate">
          ฿{item.price.toLocaleString()}
        </p>
      </div>

      {/* Quantity stepper */}
      <div className="overflow-hidden w-full">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 flex-none rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#4E0707] hover:text-[#4E0707] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={12} />
          </button>

          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            disabled={isUpdating}
            className={`w-10 text-center font-bold text-[#4E0707] bg-transparent outline-none focus:ring-1 focus:ring-gray-200 rounded 
              [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none 
              transition-all ${isUpdating ? "opacity-50" : "opacity-100"}`}
          />

          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="w-7 h-7 flex-none rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#4E0707] hover:text-[#4E0707] transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="text-right overflow-hidden">
        <p className="font-bold tabular-nums text-[#4E0707] truncate">
          ฿{total.toLocaleString()}
        </p>
      </div>

      {/* Delete */}
      <div className="flex justify-center">
        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 flex-none rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function CartEmpty() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white px-6 py-16 flex flex-col items-center gap-5 text-center min-h-72 align-center justify-center w-full max-w-lg">
      <div className="animate-[float_3s_ease-in-out_infinite] w-16 h-16 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center relative z-10">
        <ShoppingBag size={28} className="text-gray-300" />
      </div>

      <div className="flex flex-col gap-1.5 relative z-10 animate-[fadeUp_0.4s_ease_both]">
        <p className="text-lg font-bold text-gray-700">ตะกร้าของคุณว่างเปล่า</p>
        <p className="text-sm text-gray-400">
          ยังไม่มีสินค้าในตะกร้า ลองเลือกชมสินค้าดูก่อนนะครับ
        </p>
      </div>

      <div className="flex gap-2.5 relative z-10 animate-[fadeUp_0.4s_0.1s_ease_both] mt-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 bg-[#4E0707] hover:bg-[#3D0505] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <ShoppingBag size={15} />
          เลือกซื้อสินค้า
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-500 hover:text-[#4E0707] hover:border-[#4E0707] text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Home size={15} />
          หน้าหลัก
        </Link>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cartItems, isLoading, setCartItems } = useCartItems();
  const clearCartCount = useCartStore((e) => e.clearCartCount);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
          <div className="flex items-center gap-2 pt-3 mt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">กำลังโหลด</span>
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#4E0707] animate-pulse"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 flex flex-1 items-center justify-center">
        <CartEmpty />
      </main>
    );
  }

  const itemCount = cartItems.reduce((total, currentItem) => {
    return total + currentItem.quantity;
  }, 0);

  const subtotal = cartItems.reduce((total, currentItem) => {
    return total + currentItem.price * currentItem.quantity;
  }, 0);

  const handleQuantityChange = async (id: number, newQty: number) => {
    if (newQty < 1) return;

    const previousItems = [...cartItems];
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:3001/cart/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      if (!response.ok) {
        throw new Error("อัปเดตจำนวนสินค้าไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      setCartItems(previousItems);
    }
  };

  const handleRemove = async (id: number) => {
    const previousItems = [...cartItems];
    setCartItems(cartItems.filter((item) => item.id !== id));

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:3001/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("ลบสินค้าไม่สำเร็จ");
      }

      console.log(`ลบสินค้า id ${id} ออกจาก Database สำเร็จเรียบร้อย!`);
    } catch (error) {
      console.error(error);
      setCartItems(previousItems);
      alert("เกิดข้อผิดพลาด ไม่สามารถลบสินค้าได้");
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:3001/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("ล้างตะกร้าไม่สำเร็จ");
      }

      clearCartCount();
      setCartItems([]);
      console.log("ล้างตะกร้าเรียบร้อย");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการล้างตะกร้า");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-start justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold text-[#4E0707]">
          ตะกร้าสินค้า
          {cartItems.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({itemCount} ชิ้น)
            </span>
          )}
        </h1>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={16} />
            ล้างตะกร้าทั้งหมด
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white px-6 ">
            <div
              className={`grid ${GRID_COLS} gap-4 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider`}
            >
              <div />
              <div>สินค้า</div>
              <div className="text-center">ราคา</div>
              <div className="text-center">จำนวน</div>
              <div className="text-right">รวม</div>
              <div />
            </div>

            {cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

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
              <span className="font-bold text-gray-700">ทั้งหมด</span>
              <span className="text-xl font-bold text-[#4E0707]">
                ฿{subtotal.toLocaleString()}
              </span>
            </div>
            <Link
              href="/payment"
              className="w-full bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3 rounded-xl transition-colors mt-1 block text-center"
            >
              สั่งซื้อ
            </Link>
            <Link
              href="/shop"
              className="text-center text-sm text-gray-400 hover:text-[#4E0707] transition-colors"
            >
              ช้อปต่อ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
