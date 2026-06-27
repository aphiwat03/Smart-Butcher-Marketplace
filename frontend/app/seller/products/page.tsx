"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye, Search } from "lucide-react";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";
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

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "" as number | string,
    stockQuantity: "" as number | string,
  });
  const itemsPerPage = 8;

  const fetchMyProducts = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/stores/products/my-store?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
        const response = await fetch(`${API_URL}/users/products/categories`);
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
    setProductData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
    });
    setCategoryId(null);
    setImageFile(null);
    setShowForm(true);
  };

  const openEditForm = (product: any) => {
    setEditingProductId(product.id);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
    });
    setCategoryId(product.category?.id || null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    try {
      const response = await fetch(`${API_URL}/stores/products/${deleteProductId}`, {
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

  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!productData.name || !categoryId || productData.price === "" || productData.stockQuantity === "" || !productData.description) {
      toast.warning("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง");
      return;
    }

    if (!editingProductId && !imageFile) {
      toast.warning("กรุณาอัปโหลดรูปภาพสินค้า");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price.toString());
    formData.append("stockQuantity", productData.stockQuantity.toString());
    formData.append("categoryId", categoryId.toString());
    formData.append("description", productData.description);

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("บันทึกสินค้าสำเร็จ!");
        setProductData({
          name: "",
          description: "",
          price: "",
          stockQuantity: "",
        });
        setCategoryId(null);
        setImageFile(null);
        setEditingProductId(null);
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
      return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  const getStockStatus = (stock: number) => {
    if (stock > 20) return "text-green-600 font-semibold";
    if (stock > 5) return "text-yellow-600 font-semibold";
    if (stock === 0) return "text-red-600 font-semibold";
    return "text-orange-600 font-semibold";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-[#4E0707] mb-1">
            My Products
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage your product listings
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[#B4915B] hover:bg-[#9A7A48] text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#4E0707] mb-4">
              {editingProductId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Category
                </label>
                <Select
                  value={categoryId?.toString() ?? ""}
                  onValueChange={(val) => setCategoryId(Number(val))}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" className="max-h-60">
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Price (฿)
                </label>
                <input
                  type="number"
                  min="0"
                  value={productData.price}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      price: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={productData.stockQuantity}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      stockQuantity: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                />
              </div>

              <div>
                  <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                    Image {editingProductId && <span className="text-xs text-gray-500 font-normal">(Leave blank to keep existing)</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!editingProductId}
                    onChange={(e) =>
                      e.target.files && setImageFile(e.target.files[0])
                    }
                    className="w-full border rounded-lg p-2"
                  />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  required
                  placeholder="Describe your product..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-white px-6 py-2 rounded-lg font-semibold transition-colors ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#B4915B] hover:bg-[#9A7A48] cursor-pointer"
                  }`}
              >
                {isSubmitting ? "Saving..." : (editingProductId ? "Update Product" : "Save Product")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading products...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#4E0707] text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Product
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
                          className="w-12 h-12 rounded object-contain bg-gray-50 border border-gray-100"
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
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(
                          product.status,
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewProduct(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditForm(product)} className="p-2 text-[#B4915B] hover:bg-[#B4915B]/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteProductId(product.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                          ? "z-10 bg-[#B4915B] border-[#B4915B] text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active Products</p>
          <p className="text-2xl font-bold text-green-600">
            {
              products.filter((p) => p.status?.toLowerCase() === "active")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Low Stock Items</p>
          <p className="text-2xl font-bold text-yellow-600">
            {
              products.filter(
                (p) => p.stockQuantity > 0 && p.stockQuantity <= 10,
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {products.filter((p) => p.stockQuantity === 0).length}
          </p>
        </div>
      </div>

      {/* View Product Modal */}
      <Dialog open={!!viewProduct} onOpenChange={(open) => !open && setViewProduct(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#4E0707] mb-4">
              Product Details
            </DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              <img
                src={viewProduct.imageUrl || "https://placehold.co/300x200?text=No+Image"}
                alt={viewProduct.name}
                className="w-full h-48 object-contain rounded-lg bg-gray-50 border border-gray-100"
              />
              <div>
                <h3 className="text-lg font-bold text-[#4E0707]">{viewProduct.name}</h3>
                <p className="text-sm text-[#B4915B] font-semibold">{viewProduct.category?.name || "No Category"}</p>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{viewProduct.description || "No description provided."}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-bold text-[#B4915B]">฿{viewProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Quantity</p>
                  <p className={`text-lg ${getStockStatus(viewProduct.stockQuantity)}`}>{viewProduct.stockQuantity}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 mb-2">
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">Are you sure you want to delete this product? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setDeleteProductId(null)}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
