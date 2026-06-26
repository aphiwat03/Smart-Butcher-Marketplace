"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { API_URL } from "@/lib/api";
import { AdminProduct, PaginatedMeta, Category, AdminProductFilters } from "@/types/admin";
import { ProductTable } from "@/components/admin/product-table";


const DEFAULT_FILTERS: AdminProductFilters = {
  q: "",
  category: "",
  status: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const LIMIT = 15;

function buildQuery(filters: AdminProductFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  params.set("sortBy", filters.sortBy);
  params.set("sortOrder", filters.sortOrder);
  params.set("page", String(page));
  params.set("limit", String(LIMIT));
  return params.toString();
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminProductFilters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<AdminProductFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_URL}/admin/products/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => { });
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      const qs = buildQuery(filters, page);
      const res = await fetch(`${API_URL}/admin/products?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);
      const json = await res.json();
      setProducts(json.data ?? []);
      setMeta(json.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
    setPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    if (searchRef.current) searchRef.current.value = "";
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({ ...prev, q: pendingFilters.q }));
      setPage(1);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("ลบสินค้าไม่สำเร็จ");
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบ");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    filters.category ||
    filters.status ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.q;

  const sortOptions = [
    { value: "createdAt|desc", label: "ล่าสุด → เก่าสุด" },
    { value: "createdAt|asc", label: "เก่าสุด → ล่าสุด" },
    { value: "price|asc", label: "ราคา: น้อย → มาก" },
    { value: "price|desc", label: "ราคา: มาก → น้อย" },
    { value: "name|asc", label: "ชื่อ A → Z" },
    { value: "name|desc", label: "ชื่อ Z → A" },
    { value: "stockQuantity|asc", label: "สต็อก: น้อย → มาก" },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="-mx-4 -mt-14 lg:-mx-6 lg:-mt-6 mb-6 bg-white dark:bg-card border-b border-gray-200 dark:border-border px-4 py-3 lg:px-8 lg:py-4 pt-14 lg:pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-[#4E0707] dark:text-foreground flex items-center gap-2">
              <Package size={32} className="text-[#B4915B]" />
              จัดการสินค้า
            </h1>
            <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
              {meta ? (
                <>รายการสินค้าทั้งหมดในระบบ · <strong>{meta.total.toLocaleString()}</strong> รายการ</>
              ) : (
                "กำลังโหลด…"
              )}
            </p>
          </div>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors self-start sm:self-auto"
            title="รีเฟรช"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            รีเฟรช
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            id="admin-products-search"
            placeholder="ค้นหาชื่อสินค้า, ร้านค้า, หมวดหมู่… (กด Enter)"
            defaultValue={pendingFilters.q}
            onChange={(e) =>
              setPendingFilters((prev) => ({ ...prev, q: e.target.value }))
            }
            onKeyDown={handleSearchKeyDown}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4E0707]/40"
          />
        </div>

        {/* Sort */}
        <select
          id="admin-products-sort"
          value={`${filters.sortBy}|${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("|");
            setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
            setPage(1);
          }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#4E0707]/40 cursor-pointer"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          id="admin-products-filter-btn"
          onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${hasActiveFilters
            ? "border-[#4E0707] bg-[#4E0707] text-white"
            : "border-border bg-card text-foreground hover:bg-muted"
            }`}
        >
          <SlidersHorizontal size={15} />
          ตัวกรอง
          {hasActiveFilters && (
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={14} />
            ล้าง
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                หมวดหมู่
              </label>
              <select
                id="filter-category"
                value={pendingFilters.category}
                onChange={(e) =>
                  setPendingFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#4E0707]/40"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                สถานะ
              </label>
              <select
                id="filter-status"
                value={pendingFilters.status}
                onChange={(e) =>
                  setPendingFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#4E0707]/40"
              >
                <option value="">ทุกสถานะ</option>
                <option value="ACTIVE">ใช้งาน</option>
                <option value="INACTIVE">ปิดใช้งาน</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                ราคาต่ำสุด (฿)
              </label>
              <input
                id="filter-min-price"
                type="number"
                min="0"
                placeholder="0"
                value={pendingFilters.minPrice}
                onChange={(e) =>
                  setPendingFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4E0707]/40"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                ราคาสูงสุด (฿)
              </label>
              <input
                id="filter-max-price"
                type="number"
                min="0"
                placeholder="ไม่จำกัด"
                value={pendingFilters.maxPrice}
                onChange={(e) =>
                  setPendingFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4E0707]/40"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
            >
              ยกเลิก
            </button>
            <button
              id="filter-apply-btn"
              onClick={applyFilters}
              className="px-4 py-2 rounded-lg bg-[#4E0707] text-white text-sm font-medium hover:bg-[#6B0909] transition-colors flex items-center gap-2"
            >
              <Filter size={14} />
              ใช้ตัวกรอง
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDelete}
          isLoading={isDeleting}
        />
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            หน้า <strong>{meta.page}</strong> จาก <strong>{meta.totalPages}</strong>
            {" "}· {meta.total.toLocaleString()} รายการ
          </p>
          <div className="flex items-center gap-1">
            {/* First */}
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              «
            </button>

            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              ก่อน
            </button>

            {/* Page numbers */}
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === meta.totalPages ||
                  Math.abs(p - page) <= 2
              )
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                  acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`min-w-[36px] px-2 py-1.5 rounded-lg border text-sm font-medium transition-colors ${page === p
                      ? "border-[#4E0707] bg-[#4E0707] text-white"
                      : "border-border text-foreground hover:bg-muted"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ถัดไป
              <ChevronRight size={14} />
            </button>

            {/* Last */}
            <button
              onClick={() => setPage(meta.totalPages)}
              disabled={page === meta.totalPages}
              className="px-2 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
