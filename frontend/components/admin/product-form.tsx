"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<ProductFormData>;
  isEditing?: boolean;
}

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  quantity: string;
  categoryId: string;
};

const categories = [
  { id: "1", name: "เนื้อสำหรับสเต็ก" },
  { id: "2", name: "เนื้อสไลซ์ชาบู / ปิ้งย่าง" },
  { id: "3", name: "เนื้อบด" },
  { id: "4", name: "เนื้อแปรรูป" },
  { id: "5", name: "เนื้อดรายเอจ" },
  { id: "6", name: "เนื้อวากิวคัดพิเศษ" },
];

export function ProductForm({
  onSubmit,
  isLoading = false,
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setFormData((current) => ({
      ...current,
      ...initialData,
    }));
  }, [initialData]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId) {
      setError("กรุณากรอกชื่อสินค้า ราคา และหมวดหมู่");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name" className="mb-2 block">
            ชื่อสินค้า *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="เช่น ริบอายสเต็ก"
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="mb-2 block">
            คำอธิบาย
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="รายละเอียดสินค้าแบบสั้น ๆ"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="price" className="mb-2 block">
            ราคา (บาท) *
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="quantity" className="mb-2 block">
            จำนวน
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="0"
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="categoryId" className="mb-2 block">
            หมวดหมู่ *
          </Label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 border-t border-border pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสินค้าใหม่"}
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          ยกเลิก
        </Button>
      </div>
    </form>
  );
}
