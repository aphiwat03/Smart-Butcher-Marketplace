"use client";

import { useState, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
  isEditing?: boolean;
}

export function ProductForm({
  onSubmit,
  isLoading = false,
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    image: null as File | null,
    imagePreview: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();

    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        quantity: initialData.quantity || "",
        categoryId: initialData.categoryId || "",
        imagePreview: initialData.image || "",
      }));
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/products/categories");
      const data = await response.json();

      console.log("ข้อมูลจาก API:", data);
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("ไฟล์ต้องไม่เกิน 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId) {
      setError("กรุณากรอกข้อมูลที่จำเป็นทั้งหมด");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ชื่อสินค้า */}
        <div className="md:col-span-2">
          <Label htmlFor="name" className="block mb-2">
            ชื่อสินค้า *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="เช่น เนื้อวากิวพรีเมียม"
            disabled={isLoading}
          />
        </div>

        {/* คำอธิบาย */}
        <div className="md:col-span-2">
          <Label htmlFor="description" className="block mb-2">
            คำอธิบาย
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="เขียนรายละเอียดเกี่ยวกับสินค้า"
            rows={4}
            disabled={isLoading}
          />
        </div>

        {/* ราคา */}
        <div>
          <Label htmlFor="price" className="block mb-2">
            ราคา (บาท) *
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        {/* จำนวน */}
        <div>
          <Label htmlFor="quantity" className="block mb-2">
            จำนวน
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="0"
            disabled={isLoading}
          />
        </div>

        {/* หมวดหมู่ */}
        <div className="md:col-span-2">
          <Label htmlFor="categoryId" className="block mb-2">
            หมวดหมู่ *
          </Label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* รูปภาพ */}
        <div className="md:col-span-2">
          <Label className="block mb-2">รูปภาพสินค้า</Label>
          <div className="space-y-4">
            {formData.imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="h-48 w-full object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">คลิกเพื่ออัพโหลด</span> หรือ
                    ลาก-วาง
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF (ไม่เกิน 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* ปุ่ม */}
      <div className="flex gap-4 pt-6 border-t border-border">
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
