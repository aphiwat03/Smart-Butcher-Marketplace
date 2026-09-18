"use client";

import { useEffect, useState, useCallback } from "react";
import { Package, RefreshCw, Search, X } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { AdminProduct } from "@/types/admin";
import { ProductTable } from "@/components/admin/product-table";
import { Input } from "@/components/ui/input";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = useCallback(async (q: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const res = await fetchApi(`/admin/products?${params.toString()}`, {});
      if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);
      const json = await res.json();
      const rawList: AdminProduct[] = Array.isArray(json)
        ? json
        : (json.data ?? []);
      setProducts(rawList);
      setTotal(json.meta?.total ?? rawList.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch, fetchProducts]);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const res = await fetchApi(`/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบสินค้าไม่สำเร็จ");
      await fetchProducts(debouncedSearch);
    } catch (err) {
      alert(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบ");
    } finally {
      setIsDeleting(false);
    }
  };

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
              รายการสินค้าทั้งหมดในระบบ ·{" "}
              <strong>{total.toLocaleString()}</strong> รายการ
            </p>
          </div>
          <button
            onClick={() => fetchProducts(debouncedSearch)}
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

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            id="admin-products-search"
            placeholder="ค้นหาชื่อสินค้า, ร้านค้า, หมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-9 bg-card border-border rounded-lg text-sm"
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="h-10 flex items-center gap-1 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap shrink-0"
            title="ล้างคำค้นหา"
          >
            <X size={14} />
            ล้าง
          </button>
        )}
      </div>

      <ProductTable
        products={products}
        onDelete={handleDelete}
        isLoading={isLoading || isDeleting}
      />
    </div>
  );
}
