"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye, Search } from "lucide-react";

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
  });

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3001/products/my-store", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/products/categories",
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
    fetchMyProducts();
  }, []);

  const handleSaveProduct = async () => {
    if (!productData.name || !categoryId) {
      alert("กรุณากรอกชื่อสินค้าและเลือกหมวดหมู่ให้ครบถ้วน");
      return;
    }

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
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("บันทึกสินค้าสำเร็จ!");
        setShowForm(false);

        // รีเซ็ตค่าในฟอร์ม
        setProductData({
          name: "",
          description: "",
          price: 0,
          stockQuantity: 0,
        });
        setCategoryId(null);
        setImageFile(null);

        fetchMyProducts();
      } else {
        const errorData = await response.json();
        alert(`บันทึกไม่สำเร็จ: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4E0707] mb-1">
            My Products
          </h1>
          <p className="text-gray-600">Manage your product listings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#B4915B] hover:bg-[#9A7A48] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white border-2 border-[#B4915B] rounded-lg p-6 animate-[fadeUp_0.3s_ease_out]">
          <h2 className="text-xl font-bold text-[#4E0707] mb-4">
            Add New Product
          </h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                Price (฿)
              </label>
              <input
                type="number"
                value={productData.price}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    price: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                Stock
              </label>
              <input
                type="number"
                value={productData.stockQuantity}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    stockQuantity: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
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
                placeholder="Describe your product..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              ></textarea>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveProduct}
              className="bg-[#B4915B] hover:bg-[#9A7A48] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Save Product
            </button>
          </div>
        </div>
      )}

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
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.imageUrl ||
                            "https://placehold.co/150?text=No+Image"
                          } // รองรับกรณีรูปภาพเป็น null
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
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
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#B4915B] hover:bg-[#B4915B]/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found.
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
    </div>
  );
}
