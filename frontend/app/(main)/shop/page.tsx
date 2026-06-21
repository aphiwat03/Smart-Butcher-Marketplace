import Link from "next/link";
import { API_URL } from "@/lib/api";
import { ArchiveBoxIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import PriceSlider from "@/components/ui/PriceSlider";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  maxPrice?: string;
}>;

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  category: Category;
  store: {
    id: number;
    name: string;
  };
};

async function getMaxPriceLimit() {
  try {
    const response = await fetch(`${API_URL}/users/products/max-price`, {
      cache: "no-store",
    });
    if (!response.ok) return 99999;
    const data = await response.json();
    return data.maxPrice || data?._max?.price || 99999;
  } catch {
    return 99999;
  }
}

async function getProducts(params: {
  q?: string;
  category?: string;
  maxPrice?: string;
}) {
  const query = new URLSearchParams();

  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.maxPrice) query.set("maxPrice", params.maxPrice);

  try {
    const response = await fetch(
      `${API_URL}/users/products?${query.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        data: [],
        error: `Products API returned ${response.status}`,
      };
    }

    return {
      data: (await response.json()) as Product[],
      error: null,
    };
  } catch {
    return {
      data: [],
      error: `Cannot connect to products API at ${API_URL}`,
    };
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/products/categories`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    return (await response.json()) as Category[];
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedCategory = params.category ?? "";
  const keyword = params.q ?? "";
  const [productsResult, categories, maxPriceLimit] = await Promise.all([
    getProducts(params),
    getCategories(),
    getMaxPriceLimit(),
  ]);
  const products = productsResult.data;
  const title = selectedCategory || keyword || "สินค้าทั้งหมด";
  const currentSelectedMaxPrice = params.maxPrice ?? maxPriceLimit.toString();
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <form
          action="/shop"
          className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:col-span-1"
        >
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold text-[#4E0707]">
            ค้นหาสินค้า
          </h3>

          <div className="space-y-6 text-sm text-gray-600">
            <PriceSlider
              maxLimit={Number(maxPriceLimit)}
              initialValue={Number(currentSelectedMaxPrice)}
            />

            <div className="border-t border-gray-200 pt-4">
              <p className="mb-3 font-semibold text-[#4E0707]">หมวดหมู่</p>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.name}
                      defaultChecked={selectedCategory === category.name}
                      className="h-4 w-4 cursor-pointer border-gray-300 text-[#B4915B] focus:ring-[#B4915B]"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5">
              <Link
                href="/shop"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-center font-bold text-gray-700 transition-colors hover:bg-gray-100"
              >
                ล้างค่า
              </Link>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#4E0707] px-4 py-2 text-center font-bold text-white shadow-sm transition-colors hover:bg-[#3D0505]"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </form>

        <div className="lg:col-span-3">
          <h2 className="mb-6 text-2xl font-bold text-gray-500">
            ผลลัพธ์สำหรับ <span className="text-[#4E0707]">{title}</span>
          </h2>
          {productsResult.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {productsResult.error}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div>
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <p className="mb-1 truncate text-xs font-semibold text-[#B4915B]">
                        {product.category.name}
                      </p>
                      <h4 className="font-bold text-[#4E0707]">
                        {product.name}
                      </h4>
                      <p className="mt-1 font-semibold text-[#B4915B]">
                        ฿{product.price.toLocaleString()}
                      </p>
                      <span className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <StarIcon className="size-4 text-[#4E0707]" />
                        5.0 | คงเหลือ {product.stockQuantity} ชิ้น
                      </span>
                    </Link>
                  </div>
                  <span className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-[#4E0707]/80">
                    <span className="flex items-center gap-1">
                      <ArchiveBoxIcon className="h-4 w-4 text-[#B4915B]" />
                      ส่งน้อยกว่า 1 วัน
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4 text-[#B4915B]" />
                      {product.store.name}
                    </span>
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
