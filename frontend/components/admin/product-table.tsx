"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductTableProps } from "@/types/admin";

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-base select-none">
        <span>!</span>
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      {/* skeleton */}
      {!loaded && (
        <div className="absolute inset-0 rounded-lg bg-muted animate-pulse" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="40px"
        className={[
          "rounded-lg object-cover border border-border",
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProductTable({
  products,
  onDelete,
  isLoading = false,
}: ProductTableProps) {
  const handleDelete = async (id: number) => {
    if (!window.confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) return;
    await onDelete?.(id);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      ACTIVE: { color: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300", label: "ใช้งาน" },
      INACTIVE: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", label: "ปิดใช้งาน" },
    };
    const config = statusMap[status] ?? { color: "bg-gray-100 text-gray-800", label: status };
    return <Badge className={`${config.color} text-xs font-medium px-2 py-0.5`}>{config.label}</Badge>;
  };

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <p className="text-muted-foreground text-sm">ไม่พบสินค้า</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground w-12">#</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">สินค้า</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">ร้านค้า</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">หมวดหมู่</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">ราคา</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">คงเหลือ</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">สถานะ</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">วันที่เพิ่ม</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product, idx) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage src={product.imageUrl} alt={product.name} />
                    <span className="font-medium text-foreground line-clamp-2 max-w-[180px]">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.store?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  ฿{product.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-center text-foreground">
                  <span className={product.stockQuantity === 0 ? "text-red-500 font-semibold" : ""}>
                    {product.stockQuantity.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground whitespace-nowrap">
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(product.id)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      title="ลบสินค้า"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
