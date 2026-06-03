"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, Search } from "lucide-react";

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const products = [
    {
      id: 1,
      name: "เนื้อวากิวคัดพิเศษ",
      sku: "WAG-001",
      price: "฿899",
      stock: 25,
      status: "active",
      image: "mock/beef/วากิว.jpg",
      category: "เนื้อวากิวคัดพิเศษ",
      sales: 45,
    },
    {
      id: 2,
      name: "เนื้อท้องสันนอก",
      sku: "BEL-001",
      price: "฿599",
      stock: 12,
      status: "active",
      image: "mock/beef/ท้องสันนอก.png",
      category: "เนื้อสำหรับสเต็ก",
      sales: 23,
    },
    {
      id: 3,
      name: "เนื้อสันนอก",
      sku: "BEL-002",
      price: "฿699",
      stock: 8,
      status: "active",
      image: "mock/beef/เนื้อสันนอก.webp",
      category: "เนื้อสำหรับสเต็ก",
      sales: 32,
    },
    {
      id: 4,
      name: "เนื้อสันใน",
      sku: "BEL-003",
      price: "฿799",
      stock: 0,
      status: "inactive",
      image: "mock/beef/สันใน.jpeg",
      category: "เนื้อสำหรับสเต็ก",
      sales: 19,
    },
    {
      id: 5,
      name: "เนื้อบด",
      sku: "MIN-001",
      price: "฿399",
      stock: 50,
      status: "active",
      image: "mock/beef/เนื้อบด.webp",
      category: "เนื้อบด",
      sales: 28,
    },
  ];

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    if (status === "active") return "bg-green-100 text-green-800";
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

      {/* Add Product Form (Mock) */}
      {showForm && (
        <div className="bg-white border-2 border-[#B4915B] rounded-lg p-6">
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
                placeholder="e.g., เนื้อวากิวคัดพิเศษ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                SKU
              </label>
              <input
                type="text"
                placeholder="e.g., WAG-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                Price (฿)
              </label>
              <input
                type="number"
                placeholder="e.g., 899"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                Stock
              </label>
              <input
                type="number"
                placeholder="e.g., 25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your product..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
              ></textarea>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-[#B4915B] hover:bg-[#9A7A48] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Save Product
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#4E0707] text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  SKU
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Stock
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Sales
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
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold text-[#4E0707]">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm">{product.sku}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-[#B4915B]">
                    {product.price}
                  </td>
                  <td
                    className={`px-6 py-4 text-center ${getStockStatus(product.stock)}`}
                  >
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {product.sales}
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
                      <button
                        title="View"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit"
                        className="p-2 text-[#B4915B] hover:bg-[#B4915B]/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete"
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
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
            {products.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Low Stock Items</p>
          <p className="text-2xl font-bold text-yellow-600">
            {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {products.filter((p) => p.stock === 0).length}
          </p>
        </div>
      </div>
    </div>
  );
}
