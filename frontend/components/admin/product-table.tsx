"use client";

import { Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: {
    name: string;
  };
  status: string;
  createdAt: string;
}

interface ProductTableProps {
  products: Product[];
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProductTable({
  products,
  onDelete,
  isLoading = false,
}: ProductTableProps) {
  const handleDelete = async (id: string) => {
    if (!window.confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) return;

    try {
      await onDelete?.(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      ACTIVE: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
        label: "ใช้งาน",
      },
      INACTIVE: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        label: "ไม่ใช้งาน",
      },
      OUT_OF_STOCK: {
        color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
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
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">ไม่มีสินค้า</p>
        <Link href="/admin/products/new">
          <Button className="bg-primary hover:bg-primary/90">
            เพิ่มสินค้าใหม่
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full">
        <thead className="bg-accent/5 border-b border-border">
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
              className="hover:bg-accent/5 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-foreground font-medium">
                {product.name}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {product.category?.name || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-right text-foreground font-medium">
                ฿{product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-center text-foreground">
                {product.quantity} หน่วย
              </td>
              <td className="px-6 py-4 text-sm text-center">
                {getStatusBadge(product.status)}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex p-2 hover:bg-accent/20 rounded-lg transition-colors"
                    title="แก้ไข"
                  >
                    <Edit2 size={18} className="text-blue-500" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={isLoading}
                    className="inline-flex p-2 hover:bg-accent/20 rounded-lg transition-colors"
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
  );
}
