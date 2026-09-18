"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminProduct, ProductTableProps } from "@/types/admin";
import { AdminDataTable, ColumnDef } from "./admin-data-table";

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
  serverPagination,
}: ProductTableProps) {

  const handleDelete = async (id: number, productName?: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบสินค้า",
      text: productName
        ? `คุณต้องการลบสินค้า "${productName}" ใช่หรือไม่?`
        : "คุณต้องการลบสินค้านี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;
    await onDelete?.(id);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      ACTIVE: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
        label: "ใช้งาน",
      },
      INACTIVE: {
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        label: "ปิดใช้งาน",
      },
    };
    const config = statusMap[status] ?? {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };
    return (
      <Badge className={`${config.color} text-xs font-medium px-2 py-0.5`}>
        {config.label}
      </Badge>
    );
  };

  const columns: ColumnDef<AdminProduct>[] = [
    {
      header: "#",
      cell: (_product, index) => (
        <span className="text-muted-foreground">{index + 1}</span>
      ),
      className: "w-10",
      hideOnMobileCard: true,
    },
    {
      header: "สินค้า",
      mobileLabel: "สินค้า",
      className: "w-[240px]",
      cell: (product) => (
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <ProductImage src={product.imageUrl} alt={product.name} />
          <span className="font-medium text-foreground line-clamp-2 min-w-0">
            {product.name}
          </span>
        </div>
      ),
    },
    {
      header: "ร้านค้า",
      mobileLabel: "ร้านค้า",
      className: "w-[140px]",
      cell: (product) => (
        <span className="text-muted-foreground truncate block">
          {product.store?.name ?? "-"}
        </span>
      ),
    },
    {
      header: "หมวดหมู่",
      mobileLabel: "หมวดหมู่",
      className: "w-[120px]",
      cell: (product) => (
        <span className="text-muted-foreground truncate block">
          {product.category?.name ?? "-"}
        </span>
      ),
    },
    {
      header: "ราคา",
      mobileLabel: "ราคา",
      align: "right",
      className: "w-[100px]",
      cell: (product) => (
        <span className="font-semibold text-[#4E0707] dark:text-red-400 whitespace-nowrap">
          ฿{product.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "คงเหลือ",
      mobileLabel: "คงเหลือ",
      align: "center",
      className: "w-[90px]",
      cell: (product) => (
        <span
          className={
            product.stockQuantity === 0
              ? "text-red-500 font-semibold whitespace-nowrap"
              : "text-foreground font-medium whitespace-nowrap"
          }
        >
          {product.stockQuantity.toLocaleString()} ชิ้น
        </span>
      ),
    },
    {
      header: "สถานะ",
      mobileLabel: "สถานะ",
      align: "center",
      className: "w-[90px]",
      cell: (product) => getStatusBadge(product.status),
    },
    {
      header: "วันที่เพิ่ม",
      mobileLabel: "วันที่เพิ่ม",
      align: "center",
      className: "w-[110px] whitespace-nowrap text-muted-foreground",
      cell: (product) => (
        <span className="text-muted-foreground">
          {formatDate(product.createdAt)}
        </span>
      ),
    },
    {
      header: "จัดการ",
      align: "center",
      className: "w-[60px]",
      hideOnMobileCard: true,
      cell: (product) => (
        <div className="flex items-center justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(product.id, product.name)}
            disabled={isLoading}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            title="ลบสินค้า"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ),
    },
  ];


  return (
    <AdminDataTable
      data={products}
      columns={columns}
      keyExtractor={(product) => product.id}
      idExtractor={(_product, index) => index + 1}
      isLoading={isLoading}
      serverPagination={serverPagination}
      emptyMessage="ไม่พบสินค้าในระบบ"
      topRightAction={(product) => (
        <button
          type="button"
          onClick={() => handleDelete(product.id, product.name)}
          disabled={isLoading}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-400 disabled:opacity-50 transition-colors"
          title="ลบสินค้า"
        >
          <Trash2 size={15} />
        </button>
      )}
      bottomAction={(product) => (
        <button
          type="button"
          onClick={() => handleDelete(product.id, product.name)}
          disabled={isLoading}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-red-200 bg-red-50/70 text-red-600 hover:bg-red-100 text-xs font-semibold dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300 disabled:opacity-50 transition-colors"
        >
          <Trash2 size={13} />
          ลบสินค้า
        </button>
      )}
    />
  );
}
