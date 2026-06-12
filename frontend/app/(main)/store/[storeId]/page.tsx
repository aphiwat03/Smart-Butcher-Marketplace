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

type StoreProduct = {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string | null;
  badge: string | null;
};

type Store = {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  productCount: number;
  joinedAt: string;
  taxId: string;
  location: string;
  responseTime: string;
  isVerified: boolean;
  tags: string[];
  products: StoreProduct[];
};

async function getStoreData(storeId: string): Promise<Store> {
  return {
    id: storeId,
    name: "Smart Butcher Premium",
    tagline: "เนื้อคุณภาพ คัดสรรทุกชิ้น",
    imageUrl: null,
    rating: 4.8,
    reviewCount: 1024,
    productCount: 248,
    joinedAt: "2022-03-01",
    taxId: "0105565012345",
    location: "กรุงเทพมหานคร",
    responseTime: "< 1 ชั่วโมง",
    isVerified: true,
    tags: ["จัดส่งด่วน", "ห้องเย็น", "คุณภาพพรีเมียม"],
    products: [
      {
        id: 1,
        name: "เนื้อวากิวสันนอก",
        price: 899,
        unit: "200g",
        image: null,
        badge: "ขายดี",
      },
      {
        id: 2,
        name: "สเต็กสันใน",
        price: 799,
        unit: "200g",
        image: null,
        badge: null,
      },
      {
        id: 3,
        name: "เนื้อดรายเอจ 30 วัน",
        price: 1290,
        unit: "200g",
        image: null,
        badge: "ใหม่",
      },
      {
        id: 4,
        name: "เนื้อสไลซ์ชาบู",
        price: 449,
        unit: "300g",
        image: null,
        badge: null,
      },
    ],
  };
}

export default async function StorePage({
  params,
}: {
  params: { storeId: string };
}) {
  const store = await getStoreData(params.storeId);

  const joinedDate = new Date(store.joinedAt).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8">
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
            <p className="text-white/50 text-xs mt-1">{store.tagline}</p>
          </div>

          {store.isVerified && (
            <div className="flex items-center gap-1.5 text-[#B4915B] text-xs">
              <BadgeCheck size={14} />
              ร้านค้าที่ยืนยันแล้ว
            </div>
          )}
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
          <div className="flex flex-wrap justify-between gap-2.5 text-sm text-gray-600">
            <div className="flex items-center w-1/2 gap-2 ">
              <Calendar size={15} className="text-[#B4915B]" />
              เข้าร่วมเมื่อ <span className="text-gray-900">{joinedDate}</span>
            </div>
            <div className="flex items-center w-1/2 gap-2 ">
              <IdCard size={15} className="text-[#B4915B]" />
              เลขนิติบุคคล <span className="text-gray-900">{store.taxId}</span>
            </div>
            <div className="flex items-center w-1/2 gap-2">
              <MapPin size={15} className="text-[#B4915B]" />
              <span className="text-gray-900">{store.location}</span>
            </div>
            <div className="flex items-center w-1/2 gap-2">
              <Clock size={15} className="text-[#B4915B]" />
              ตอบแชทภายใน{" "}
              <span className="text-green-600 font-medium">
                {store.responseTime}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap grop">
            {store.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border border-[#B4915B] text-[#4E0707] bg-[#FDF6EE] px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <StoreProductList products={store.products} storeName={store.name} />
    </main>
  );
}
