import Link from "next/link";
import { API_URL } from "@/lib/api";
import { ArchiveBoxIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import PriceSlider from "@/components/ui/PriceSlider";
import { ShopSearchParams, Category, ShopProduct } from "@/types/shop";
import ShopScrollHandler from "./ShopScrollHandler";
import ShopProductImage from "./ShopProductImage";

const PAGE_SIZE = 12;

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
  minPrice?: string;
  page?: string;
}) {
  const query = new URLSearchParams();

  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.maxPrice) query.set("maxPrice", params.maxPrice);
  if (params.minPrice) query.set("minPrice", params.minPrice);
  query.set("page", params.page || "1");
  query.set("limit", String(PAGE_SIZE));

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
        meta: null,
        error: `Products API returned ${response.status}`,
      };
    }

    const result = await response.json();

    // Support both direct array response or { data, meta } structure
    const isArray = Array.isArray(result);
    const productsData = isArray ? result : (result.data || []);
    const metaData = isArray ? null : (result.meta || null);

    return {
      data: productsData as ShopProduct[],
      meta: metaData,
      error: null,
    };
  } catch {
    return {
      data: [],
      meta: null,
      error: `Cannot connect to products API at ${API_URL}`,
    };
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/users/products/categories`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    return (await response.json()) as Category[];
  } catch {
    return [];
  }
}

function buildPageUrl(
  params: Record<string, string | undefined>,
  page: number,
) {
  const q = new URLSearchParams();
  if (params.q) q.set("q", params.q);
  if (params.category) q.set("category", params.category);
  if (params.maxPrice) q.set("maxPrice", params.maxPrice);
  if (params.minPrice) q.set("minPrice", params.minPrice);
  q.set("page", String(page));
  return `/shop?${q.toString()}`;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
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
  const meta = productsResult.meta;
  const title = selectedCategory || keyword || "สินค้าทั้งหมด";
  const currentPage = Number(params.page || "1");
  const currentSelectedMaxPrice = params.maxPrice ?? maxPriceLimit.toString();
  const currentSelectedMinPrice = params.minPrice ?? "0";

  // Build visible page numbers (max 5 around current)
  const totalPages = meta?.totalPages ?? 1;
  const pageWindow = 2;
  const startPage = Math.max(1, currentPage - pageWindow);
  const endPage = Math.min(totalPages, currentPage + pageWindow);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const castParams = params as Record<string, string | undefined>;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10 flex-1 flex flex-col">
      <ShopScrollHandler />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <form
          key={JSON.stringify(params)}
          action="/shop"
          className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:col-span-1"
        >
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold text-[#4E0707]">
            ค้นหาสินค้า
          </h3>

          <div className="space-y-6 text-sm text-gray-600">
            <PriceSlider
              maxLimit={Number(maxPriceLimit)}
              initialMaxValue={Number(currentSelectedMaxPrice)}
              initialMinValue={Number(currentSelectedMinPrice)}
            />

            <div className="border-t border-gray-200 pt-4">
              <p className="mb-3 font-semibold text-[#4E0707]">หมวดหมู่</p>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    defaultChecked={!selectedCategory}
                    className="h-4 w-4 cursor-pointer border-gray-300 text-[#B4915B] focus:ring-[#B4915B]"
                  />
                  <span className={!selectedCategory ? "font-bold text-[#4E0707]" : ""}>ทั้งหมด</span>
                </label>
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
                    <span className={selectedCategory === category.name ? "font-bold text-[#4E0707]" : ""}>
                      {category.name}
                    </span>
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

        <div className="lg:col-span-3 flex flex-col min-h-[50vh]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-500">
              ผลลัพธ์สำหรับ <span className="text-[#4E0707]">{title}</span>
            </h2>
            {meta && (
              <span className="text-sm text-gray-400">
                ทั้งหมด {meta.total} รายการ
              </span>
            )}
          </div>

          {productsResult.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {productsResult.error}
            </div>
          ) : products.length === 0 ? (
            <div className="flex-1 rounded-xl border border-dashed border-gray-300 bg-white p-10 flex items-center justify-center text-gray-500">
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
                        <ShopProductImage src={product.imageUrl} alt={product.name} />
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
                        {product.averageRating ? product.averageRating.toFixed(1) : "0"} ({product.reviewCount || 0}) | คงเหลือ {product.stockQuantity} ชิ้น
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

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1 border-t border-gray-200 pt-6">
              {/* Prev */}
              <Link
                href={buildPageUrl(castParams, Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold transition-colors text-sm ${
                  currentPage === 1
                    ? "pointer-events-none bg-gray-100 text-gray-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ‹
              </Link>

              {/* First page + ellipsis */}
              {startPage > 1 && (
                <>
                  <Link
                    href={buildPageUrl(castParams, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    1
                  </Link>
                  {startPage > 2 && (
                    <span className="flex h-9 w-9 items-center justify-center text-gray-400 text-sm">
                      …
                    </span>
                  )}
                </>
              )}

              {/* Page window */}
              {pageNumbers.map((page) => (
                <Link
                  key={page}
                  href={buildPageUrl(castParams, page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    page === currentPage
                      ? "bg-[#4E0707] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </Link>
              ))}

              {/* Last page + ellipsis */}
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="flex h-9 w-9 items-center justify-center text-gray-400 text-sm">
                      …
                    </span>
                  )}
                  <Link
                    href={buildPageUrl(castParams, totalPages)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {totalPages}
                  </Link>
                </>
              )}

              {/* Next */}
              <Link
                href={buildPageUrl(
                  castParams,
                  Math.min(totalPages, currentPage + 1),
                )}
                aria-disabled={currentPage === totalPages}
                className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold transition-colors text-sm ${
                  currentPage === totalPages
                    ? "pointer-events-none bg-gray-100 text-gray-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ›
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
