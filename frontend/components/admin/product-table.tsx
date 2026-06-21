"use client";

import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ProductTableProps } from "@/types/admin";

export function ProductTable({
  products,
  onDelete,
  isLoading = false,
}: ProductTableProps) {
  const handleDelete = async (id: string) => {
    if (!window.confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) return;

    await onDelete?.(id);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      ACTIVE: {
        color: "bg-green-100 text-green-800",
        label: "ใช้งาน",
      },
      INACTIVE: {
        color: "bg-gray-100 text-gray-800",
        label: "ไม่ใช้งาน",
      },
      OUT_OF_STOCK: {
        color: "bg-red-100 text-red-800",
        label: "หมด",
      },
    };

    const config = statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card py-12 text-center">
        <p className="mb-4 text-gray-500">ไม่มีสินค้า</p>
        <Link href="/admin/products/new">
          <Button className="bg-[#4E0707] hover:bg-[#6B0909] text-white">
            เพิ่มสินค้าใหม่
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-border bg-accent/5">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                ชื่อสินค้า
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                หมวดหมู่
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-foreground">
                ราคา
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-foreground">
                จำนวน
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-foreground">
                สถานะ
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-foreground">
                ดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-accent/5"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.category?.name || "-"}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                  ฿{product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center text-sm text-foreground">
                  {product.quantity} หน่วย
                </td>
                <td className="px-6 py-4 text-center text-sm">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex rounded-lg p-2 transition-colors hover:bg-accent/20"
                      title="แก้ไข"
                    >
                      <Edit2 size={18} className="text-blue-500" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={isLoading}
                      className="inline-flex rounded-lg p-2 transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                      title="ลบ"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
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
