"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/admin/product-table";

const mockProducts = [
  {
    id: "1",
    name: "สันในสเต็ก",
    price: 1290,
    quantity: 24,
    category: { name: "เนื้อสำหรับสเต็ก" },
    status: "ACTIVE",
    createdAt: "2026-06-01",
  },
  {
    id: "2",
    name: "ริบอายสไลซ์",
    price: 520,
    quantity: 18,
    category: { name: "เนื้อสไลซ์ชาบู / ปิ้งย่าง" },
    status: "ACTIVE",
    createdAt: "2026-06-01",
  },
  {
    id: "3",
    name: "เนื้อบดสำหรับเบอร์เกอร์",
    price: 340,
    quantity: 0,
    category: { name: "เนื้อบด" },
    status: "OUT_OF_STOCK",
    createdAt: "2026-06-01",
  },
  {
    id: "4",
    name: "ดรายเอจริบอาย 30 วัน",
    price: 1850,
    quantity: 7,
    category: { name: "เนื้อดรายเอจ" },
    status: "ACTIVE",
    createdAt: "2026-06-01",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.category.name.toLowerCase().includes(keyword),
    );
  }, [products, searchTerm]);

  const handleDelete = async (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            จัดการสินค้า
          </h1>
          <p className="text-muted-foreground">
            รวมทั้งหมด {filteredProducts.length} รายการ
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus size={20} />
            เพิ่มสินค้าใหม่
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ค้นหาชื่อสินค้าหรือหมวดหมู่..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ProductTable products={filteredProducts} onDelete={handleDelete} />
    </div>
  );
}
