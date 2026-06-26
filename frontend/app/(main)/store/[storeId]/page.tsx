import Image from "next/image";
import {
  BadgeCheck,
  Calendar,
  Star,
  MapPin,
  Clock,
  IdCard,
} from "lucide-react";
import { StoreProductList } from "@/components/store/store-product-list";
import { StoreProduct, Store } from "@/types/store";

import { API_URL } from "@/lib/api";

async function getStoreData(storeId: string): Promise<Store> {
  const res = await fetch(`${API_URL}/users/stores/${storeId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch store data");
  }
  return res.json();
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const resolvedParams = await params;
  const store = await getStoreData(resolvedParams.storeId);

  const joinedDate = new Date(store.createdAt).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 flex-1 flex flex-col gap-8">
      <section className="grid grid-cols-[1fr_3fr] border border-gray-200 rounded-xl overflow-hidden">
        {/* Left */}
        <div className="bg-[#1a0202] flex flex-col items-center justify-center gap-4 px-5 py-8">
          <div className="w-24 h-24 rounded-full border-2 border-[#B4915B] overflow-hidden bg-[#4E0707] flex items-center justify-center">
            {store.imageUrl ? (
              <Image
                src={store.imageUrl}
                alt={store.name}
                width={96}
                height={96}
                className="object-cover"
              />
            ) : (
              <span className="text-[#B4915B] text-4xl font-bold">
                {store.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="text-center">
            <p className="text-white font-bold text-base leading-snug">
              {store.name}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                val: store.productCount.toLocaleString(),
                label: "รายการสินค้า",
              },
              {
                val: store.rating.toFixed(1),
                label: "คะแนนร้านค้า",
                icon: (
                  <Star size={14} className="text-[#B4915B] fill-[#B4915B]" />
                ),
              },
              {
                val: store.reviewCount.toLocaleString(),
                label: "รีวิวทั้งหมด",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 rounded-lg p-3  cursor-pointer"
              >
                <div className="flex items-center gap-1 text-xl font-bold text-[#4E0707]">
                  {s.val} {s.icon}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-2.5 text-sm text-gray-600 border-t pt-4 mt-2">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#B4915B]" />
              เข้าร่วมเมื่อ <span className="text-gray-900">{joinedDate}</span>
            </div>
            {store.description && (
              <div className="text-gray-600 mt-1 leading-relaxed border-l-2 border-[#B4915B] pl-3">
                {store.description}
              </div>
            )}
          </div>
        </div>
      </section>

      <StoreProductList products={store.products} storeName={store.name} />
    </main>
  );
}
