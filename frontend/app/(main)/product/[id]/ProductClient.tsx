"use client";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft } from "lucide-react";
import ShopProductImage from "@/app/(main)/shop/ShopProductImage";
import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { ProductDetailProps } from "@/types/product";
import { toast } from "react-toastify";

type Review = {
  id: number;
  point: number;
  description: string | null;
  createdAt: string;
  user: { fullName: string };
};

export default function ProductClient({
  product,
  reviews = [],
}: ProductDetailProps & { reviews?: Review[] }) {
  const router = useRouter();
  const token = localStorage.getItem("accessToken");
  const [quantity, setQuantity] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const productId = product.id;
  const fetchCartCount = useCartStore((e) => e.fetchCartCount);

  // Compute review stats from real data
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.point, 0) / totalReviews
      : 0;
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.point === star).length,
  }));

  const filteredReviews = filterRating === null ? reviews : reviews.filter(r => r.point === filterRating);

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
      const response = await fetch(`${API_URL}/cart`, {
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
        toast.success("เพิ่มสินค้าลงตระกร้าสำเร็จ");
        fetchCartCount();
      } else if (!response.ok) {
        toast.error("เพิ่มสินค้าลงตะกร้าไม่สำเร็จ");
      }
    } catch (error) {
      toast.error("เพิ่มข้อมูลลงตะกร้าไม่ได้");
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
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#4E0707] transition-colors font-medium w-fit"
            >
              <ArrowLeft className="size-5" />
              <span>กลับไปเลือกซื้อสินค้า</span>
            </Link>
          </div>
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden relative">
            <ShopProductImage src={product.imageUrl} alt={product.name} />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square bg-gray-200 rounded-xl cursor-pointer border-2 border-[#B4915B] flex items-center justify-center overflow-hidden relative">
              <ShopProductImage src={product.imageUrl} alt="thumb" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center">
          <Link href={`/store/${product.store.id}`}>
            <span className="text-base font-semibold text-[#B4915B] uppercase tracking-wider">
              ร้านค้า: {product.store.name}
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-[#4E0707] mt-1">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`size-4 ${
                    star <= Math.round(avgRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>
              {avgRating > 0 ? avgRating.toFixed(1) : "0"} (รีวิว {totalReviews} รายการ) | หมวดหมู่: {product.category.name}
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
                className="flex-1 flex items-center justify-center gap-2 bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3.5 px-6 cursor-pointer rounded-xl transition-colors shadow-md"
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
          {/* Average Score */}
          <div className="flex flex-col items-center justify-center bg-white/60 py-4 px-8 rounded-xl min-w-[150px]">
            <span className="text-5xl font-bold text-[#4E0707]">
              {avgRating > 0 ? avgRating.toFixed(1) : "0"}
            </span>
            <div className="flex mt-2 gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`size-5 ${
                    star <= Math.round(avgRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Star filter buttons */}
          <div className="flex flex-wrap gap-3 w-full">
            <button 
              onClick={() => setFilterRating(null)}
              className={`px-5 py-2 font-bold rounded-lg shadow-sm transition-colors ${
                filterRating === null
                  ? "bg-white text-[#4E0707] border-2 border-white"
                  : "bg-white/40 hover:bg-white/60 text-[#4E0707] border border-white/50"
              }`}
            >
              ทั้งหมด ({totalReviews})
            </button>
            {starCounts.map(({ star, count }) => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`px-5 py-2 font-medium rounded-lg shadow-sm transition-colors ${
                  filterRating === star
                    ? "bg-white text-[#4E0707] border-2 border-white"
                    : "bg-white/40 hover:bg-white/60 text-[#4E0707] border border-white/50"
                }`}
              >
                {star} ดาว ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="mt-8 space-y-8">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {filterRating ? `ยังไม่มีรีวิว ${filterRating} ดาว` : "ยังไม่มีรีวิวสำหรับสินค้านี้"}
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="pb-8 border-b border-gray-100 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.user.fullName)}`}
                      alt={review.user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-[#4E0707]">{review.user.fullName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`size-4 ${
                              star <= review.point
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("th-TH", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {review.description && (
                      <p className="mt-4 text-gray-700 leading-relaxed">
                        {review.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
