"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useCartStore } from "@/store/useCartStore";

interface ProductDetailProps {
  product: {
    id: number;
    storeId: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    status: string;
    category: {
      name: string;
      description: string;
    };
    store: {
      name: string;
    };
  };
}

export default function ProductClient({ product }: ProductDetailProps) {
  const router = useRouter();
  const token = localStorage.getItem("accessToken");
  const [quantity, setQuantity] = useState(1);
  const productId = product.id;
  const fetchCartCount = useCartStore((e) => e.fetchCartCount);
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        กำลังโหลดข้อมูล...
      </div>
    );
  }
  const addCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      if (!token) {
        Swal.fire({
          title: "Unauthorization",
          text: "กรุณาเข้าสู่ระบบก่อน",
          icon: "warning",
          confirmButtonColor: "#4E0707",
        }).then(() => {
          router.push("/login");
        });
      } else if (response.ok) {
        console.log("Add to cart: ", data);
        fetchCartCount();
      } else if (!response.ok) {
        console.log("ส่งไม่สำเร็จ");
      }
    } catch (error) {
      Swal.fire({
        title: "Add to Cart Error",
        text: "เพิ่มข้อมูลลงตระดร้าไม่ได้",
        icon: "warning",
        confirmButtonColor: "#4E0707",
      });
    }
  };

  const increaseQty = () => {
    setQuantity((prev) => (prev < product.stockQuantity ? prev + 1 : prev));
  };
  const decreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square bg-gray-200 rounded-xl cursor-pointer border-2 border-[#B4915B] flex items-center justify-center overflow-hidden">
              <img
                src={product.imageUrl}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center">
          <Link href={`/store/${product.store.id}`}>
            <span className="text-xs font-semibold text-[#B4915B] uppercase tracking-wider">
              ร้านค้า: {product.store.name}
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-[#4E0707] mt-1">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <div className="flex text-[#B4915B]">
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
            </div>
            <span>
              5.0 (รีวิว 128 รายการ) | หมวดหมู่: {product.category.name}
            </span>
          </div>
          <p className="text-gray-600 mt-6 leading-relaxed">
            {product.description}
          </p>
          <div className="text-4xl font-bold text-[#B4915B] mt-6">
            ฿{product.price.toLocaleString()}
          </div>
          <div className="mt-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white">
                <button
                  type="button"
                  onClick={decreaseQty}
                  className="p-3 hover:bg-gray-50 text-gray-600 rounded-l-xl transition-colors"
                >
                  <MinusIcon className="size-5" />
                </button>
                <span className="w-12 text-center font-bold text-lg text-[#4E0707]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQty}
                  className="p-3 hover:bg-gray-50 text-gray-600 rounded-r-xl transition-colors"
                >
                  <PlusIcon className="size-5" />
                </button>
              </div>

              <button
                className="flex-1 flex items-center justify-center gap-2 bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md"
                onClick={addCart}
              >
                <ShoppingCartIcon className="size-5" />
                Add to Cart
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2 ml-1">
              (มีสินค้าคงเหลือในระบบ {product.stockQuantity} ชิ้น)
            </p>
          </div>
          <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500">หมวดหมู่หลัก</span>
              <span className="font-bold text-[#4E0707]">
                {product.category.name}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500">การจัดส่ง (Shipping)</span>
              <span className="font-bold text-[#4E0707]">
                รถควบคุมอุณหภูมิ (Cold Chain)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">สถานะสินค้า</span>
              <span
                className={`font-bold ${product.status === "ACTIVE" ? "text-green-600" : "text-red-500"}`}
              >
                {product.status === "ACTIVE" ? "พร้อมจำหน่าย" : "หมด temporary"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-[#4E0707] mb-6">
          รายละเอียดสินค้า
        </h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed">
          <p>{product.description}</p>
          <p className="text-sm text-gray-400 mt-2">
            ข้อมูลหมวดหมู่: {product.category.description}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-[#4E0707] mb-6">
          คะแนนและรีวิวสินค้า
        </h2>

        <div className="bg-[#F9A6A6] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex flex-col items-center justify-center bg-white/60 py-4 px-8 rounded-xl min-w-[150px]">
            <span className="text-5xl font-bold text-[#4E0707]">5.0</span>
            <div className="flex text-[#B4915B] mt-2 gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} className="size-5" />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full">
            <button className="px-5 py-2 bg-white text-[#4E0707] font-bold border-2 border-white rounded-lg shadow-sm">
              ทั้งหมด (128)
            </button>
            <button className="px-5 py-2 bg-white/40 hover:bg-white/60 text-[#4E0707] font-medium border border-white/50 rounded-lg transition-colors">
              5 ดาว (118)
            </button>
            <button className="px-5 py-2 bg-white/40 hover:bg-white/60 text-[#4E0707] font-medium border border-white/50 rounded-lg transition-colors">
              4 ดาว (5)
            </button>
            <button className="px-5 py-2 bg-white/40 hover:bg-white/60 text-[#4E0707] font-medium border border-white/50 rounded-lg transition-colors">
              3 ดาว (2)
            </button>
            <button className="px-5 py-2 bg-white/40 hover:bg-white/60 text-[#4E0707] font-medium border border-white/50 rounded-lg transition-colors">
              2 ดาว (1)
            </button>
            <button className="px-5 py-2 bg-white/40 hover:bg-white/60 text-[#4E0707] font-medium border border-white/50 rounded-lg transition-colors">
              1 ดาว (1)
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div className="pb-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=Pat`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-[#4E0707]">Pat T.</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex text-[#B4915B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="size-4" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    09 มิ.ย. 2026 14:30
                  </span>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  เนื้อคุณภาพดีมากครับ แพ็คมาอย่างดี ใส่เจลเย็นมาเต็มกล่อง
                  เอามาทอดเนยกระเทียมหอมสุดๆ เนื้อนุ่มละลายในปาก
                  แนะนำร้านนี้เลยครับ!
                </p>

                <div className="flex gap-3 mt-4">
                  <div className="size-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:opacity-80 transition-opacity">
                    รูป 1
                  </div>
                  <div className="size-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:opacity-80 transition-opacity">
                    รูป 2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
