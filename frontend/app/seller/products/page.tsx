"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  UploadCloud,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-toastify";
import { API_URL, fetchApi } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const productSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  price: z.number().min(0, "ราคาต้องไม่ต่ำกว่า 0 บาท"),
  stockQuantity: z
    .number()
    .int("สต็อกต้องเป็นจำนวนเต็ม")
    .min(0, "สต็อกต้องไม่ต่ำกว่า 0"),
  description: z.string().min(1, "กรุณากรอกรายละเอียดสินค้า"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      stockQuantity: 0,
      description: "",
    },
  });

  const fetchMyProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetchApi(
        `/stores/products/my-store?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else {
        setProducts(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi(`/users/products/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMyProducts(currentPage);
  }, [currentPage]);

  const openAddForm = () => {
    setEditingProductId(null);
    form.reset({
      name: "",
      categoryId: "",
      price: 0,
      stockQuantity: 0,
      description: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEditForm = (product: any) => {
    setEditingProductId(product.id);
    form.reset({
      name: product.name,
      categoryId: product.category?.id ? String(product.category.id) : "",
      price: product.price,
      stockQuantity: product.stockQuantity,
      description: product.description || "",
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    try {
      const response = await fetchApi(`/stores/products/${deleteProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        toast.success("ลบสินค้าเรียบร้อยแล้ว");
        setDeleteProductId(null);
        fetchMyProducts(currentPage);
      } else {
        const errorData = await response.json();
        toast.error(`ลบสินค้าไม่สำเร็จ: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server");
    }
  };

  const handleSaveProduct = async (values: ProductFormValues) => {
    if (!editingProductId && !imageFile) {
      toast.warning("กรุณาอัปโหลดรูปภาพสินค้า");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price.toString());
    formData.append("stockQuantity", values.stockQuantity.toString());
    formData.append("categoryId", values.categoryId);
    formData.append("description", values.description);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      const url = editingProductId
        ? `${API_URL}/stores/products/${editingProductId}`
        : `${API_URL}/stores/products`;
      const method = editingProductId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        toast.success(
          editingProductId
            ? "อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว!"
            : "เพิ่มสินค้าใหม่เรียบร้อยแล้ว!",
        );
        setShowForm(false);
        fetchMyProducts(currentPage);
      } else {
        const errorData = await response.json();
        toast.error(`บันทึกไม่สำเร็จ: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    if (status?.toLowerCase() === "active")
      return "bg-emerald-50 text-emerald-700 border border-emerald-300";
    return "bg-rose-50 text-rose-700 border border-rose-300";
  };

  const getStockStatus = (stock: number) => {
    if (stock > 20) return "text-green-600 font-semibold";
    if (stock > 5) return "text-yellow-600 font-semibold";
    if (stock === 0) return "text-red-600 font-semibold";
    return "text-orange-600 font-semibold";
  };

  return (
    <div className="space-y-6">
      {/* Summary Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        {/* Active Products */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs sm:text-base font-medium text-gray-500">
              Active Products
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-500">
              {
                products.filter((p) => p.status?.toLowerCase() === "active")
                  .length
              }
            </p>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              พร้อมจำหน่ายในร้าน
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs sm:text-base font-medium text-gray-500">
              Low Stock Items
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">
              {
                products.filter(
                  (p) => p.stockQuantity > 0 && p.stockQuantity <= 10,
                ).length
              }
            </p>
            <p className="text-xs text-amber-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              สินค้าใกล้หมด (≤ 10 ชิ้น)
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs sm:text-base font-medium text-gray-500">
              Out of Stock
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-rose-600">
              {products.filter((p) => p.stockQuantity === 0).length}
            </p>
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              สินค้าหมดสต็อก
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal with react-hook-form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#4E0707]">
              {editingProductId
                ? "แก้ไขข้อมูลสินค้า (Edit Product)"
                : "เพิ่มสินค้าใหม่ (Add New Product)"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSaveProduct)}
              className="space-y-4 pt-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[#4E0707]">
                        ชื่อสินค้า
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="เช่น เนื้อริบอายวากิว A5"
                          className="rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4E0707]">หมวดหมู่</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="เลือกหมวดหมู่..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          className="max-h-60"
                        >
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4E0707]">
                        ราคา (บาท)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="0.00"
                          className="rounded-lg"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock Quantity */}
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4E0707]">
                        จำนวนสต็อก (ชิ้น/แพ็ค)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          className="rounded-lg"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Modern Image Upload Area with Preview */}
                <div className="md:col-span-2">
                  <FormLabel className="text-[#4E0707] mb-2 block">
                    รูปภาพสินค้า{" "}
                    {!editingProductId && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>

                  {imagePreview ? (
                    <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center p-3 max-h-64">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="max-h-56 w-auto object-contain rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label
                          htmlFor="product-image-upload"
                          className="cursor-pointer bg-white text-gray-800 hover:text-[#4E0707] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> เปลี่ยนรูปภาพ
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="cursor-pointer bg-red-600 text-white hover:bg-red-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> ลบรูปภาพ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="product-image-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#B4915B] rounded-lg p-6 bg-gray-50/70 hover:bg-[#B4915B]/5 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white shadow-xs border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-6 h-6 text-[#B4915B]" />
                      </div>
                      <p className="text-sm font-semibold text-[#4E0707] group-hover:text-[#B4915B]">
                        คลิกเพื่ออัปโหลดรูปภาพสินค้า
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        รองรับไฟล์ PNG, JPG, JPEG หรือ WEBP (สูงสุด 5MB)
                      </p>
                    </label>
                  )}

                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[#4E0707]">
                        รายละเอียดสินค้า
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="ระบุรายละเอียด เช่น ชิ้นส่วน คุณภาพ แหล่งกำเนิด หรือวิธีเก็บรักษา..."
                          rows={3}
                          className="rounded-lg resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg px-5 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#B4915B] hover:bg-[#9A7A48] text-white rounded-lg px-6 py-2 font-semibold shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      กำลังบันทึก...
                    </>
                  ) : editingProductId ? (
                    "อัปเดตสินค้า"
                  ) : (
                    "บันทึกสินค้า"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-[42px] rounded-none border-gray-300"
          />
        </div>
        <Button
          onClick={openAddForm}
          className="bg-[#B4915B] hover:bg-[#9A7A48] text-white px-4 h-[42px] rounded-none font-semibold text-sm transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          เพิ่มสินค้า
        </Button>
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading products...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#4E0707] text-white">
                  <th className="px-6 py-3.5 text-left text-sm font-semibold">
                    Product
                  </th>
                  <th className="px-6 py-3.5 text-center text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-3.5 text-center text-sm font-semibold">
                    Stock
                  </th>
                  <th className="px-6 py-3.5 text-center text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/70"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.imageUrl ||
                            "https://placehold.co/150?text=No+Image"
                          }
                          alt={product.name}
                          className="w-12 h-12 rounded-none object-contain bg-gray-50 border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-[#4E0707]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category?.name || "ไม่มีหมวดหมู่"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#B4915B]">
                      ฿{product.price}
                    </td>
                    <td
                      className={`px-6 py-4 text-center ${getStockStatus(product.stockQuantity)}`}
                    >
                      {product.stockQuantity}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-none inline-block ${getStatusBadge(
                          product.status,
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Menu as="div" className="inline-block text-left">
                        <MenuButton
                          type="button"
                          className="p-1.5 text-gray-500 hover:text-[#4E0707] hover:bg-gray-100 rounded-none transition-colors focus:outline-hidden cursor-pointer"
                          title="ตัวเลือกการจัดการ"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </MenuButton>

                        {/* ใช้ anchor="bottom end" เพื่อให้เมนูลอยทะลุหลุดพ้น overflow ของ table */}
                        <MenuItems
                          anchor={{ to: "bottom end", gap: 4 }}
                          transition
                          className="z-50 w-44 rounded-none bg-white p-1 shadow-xl ring-1 ring-black/10 focus:outline-hidden transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                          <MenuItem>
                            <button
                              type="button"
                              onClick={() => setViewProduct(product)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-none transition-colors cursor-pointer data-focus:bg-gray-100 data-focus:text-[#4E0707]"
                            >
                              <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                              <span>ดูรายละเอียด</span>
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type="button"
                              onClick={() => openEditForm(product)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-none transition-colors cursor-pointer data-focus:bg-gray-100 data-focus:text-[#4E0707]"
                            >
                              <Edit2 className="w-4 h-4 text-[#B4915B] shrink-0" />
                              <span>แก้ไขสินค้า</span>
                            </button>
                          </MenuItem>
                          <div className="my-1 border-t border-gray-100" />
                          <MenuItem>
                            <button
                              type="button"
                              onClick={() => setDeleteProductId(product.id)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-none transition-colors cursor-pointer data-focus:bg-red-50 data-focus:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 shrink-0" />
                              <span>ลบสินค้า</span>
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot></tfoot>
            </table>
          )}
        </div>
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found.
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-none shadow-xs -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-none border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-none cursor-pointer ${
                        currentPage === i + 1
                          ? "z-10 bg-[#B4915B] border-[#B4915B] text-white font-semibold"
                          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-none border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="sr-only">Next</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Product Modal */}
      <Dialog
        open={!!viewProduct}
        onOpenChange={(open) => !open && setViewProduct(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#4E0707] mb-4">
              Product Details
            </DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              <img
                src={
                  viewProduct.imageUrl ||
                  "https://placehold.co/300x200?text=No+Image"
                }
                alt={viewProduct.name}
                className="w-full h-48 object-contain rounded-lg bg-gray-50 border border-gray-100"
              />
              <div>
                <h3 className="text-lg font-bold text-[#4E0707]">
                  {viewProduct.name}
                </h3>
                <p className="text-sm text-[#B4915B] font-semibold">
                  {viewProduct.category?.name || "No Category"}
                </p>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {viewProduct.description || "No description provided."}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-bold text-[#B4915B]">
                    ฿{viewProduct.price}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Quantity</p>
                  <p
                    className={`text-lg ${getStockStatus(viewProduct.stockQuantity)}`}
                  >
                    {viewProduct.stockQuantity}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteProductId}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 mb-2">
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteProductId(null)}
              className="rounded-lg px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="rounded-lg px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-xs"
            >
              ยืนยันการลบ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
