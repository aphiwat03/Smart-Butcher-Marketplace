"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_URL } from "@/lib/api";

type OrderStatus =
  | "All"
  | "PENDING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  store: {
    name: string;
  };
}

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: Product;
}

interface Order {
  id: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
}

interface ApiResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusOptions: { label: string; value: OrderStatus }[] = [
  { label: "All", value: "All" },
  { label: "ที่ต้องชำระ", value: "PENDING" },
  { label: "ที่ต้องได้รับ", value: "DELIVERED" },
  { label: "สำเร็จ", value: "COMPLETED" },
  { label: "ยกเลิก", value: "CANCELLED" },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "ที่ต้องชำระ",
    SHIPPED: "ที่ต้องจัดส่ง",
    DELIVERED: "ที่ต้องได้รับ",
    COMPLETED: "สำเร็จ",
    CANCELLED: "ยกเลิก",
  };
  return statusMap[status] || status;
};

export default function OrderPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 5;

  const filteredOrders = allOrders.filter(
    (order) => selectedStatus === "All" || order.orderStatus === selectedStatus,
  );

  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/users/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders (Status: ${response.status})`);
      }
      const result = await response.json();
      console.log(result);
      const orderData = Array.isArray(result) ? result : result.data || [];
      setAllOrders(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            รายการคำสั่งซื้อ
          </h1>
          <p className="text-gray-600">จัดการและติดตามคำสั่งซื้อของคุณ</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === option.value
                  ? "bg-[#4E0707] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">เกิดข้อผิดพลาด: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่มีคำสั่งซื้อ</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Order Header with Store Name */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                <div>
                  <Link
                    href={`/shop`}
                    className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors"
                  >
                    {order.orderItems[0]?.product.store.name || "Store"}
                  </Link>
                </div>
                <Badge
                  className={`${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"}`}
                >
                  {getStatusLabel(order.orderStatus)}
                </Badge>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="px-6 py-4 space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      {/* Left - Product Image, Name, Quantity */}
                      <div className="flex gap-4 flex-1">
                        <div className="flex-shrink-0 w-20 h-20">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.product.id}`}
                            className="font-medium text-gray-900 hover:text-red-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            จำนวน: {item.quantity} x ฿
                            {item.unitPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Right - Price */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ฿{item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Separator between items */}
                    {index < order.orderItems.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Total */}
              <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
                <span className="font-semibold text-gray-700">
                  รวมทั้งสิ้น:
                </span>
                <span className="text-2xl font-bold text-red-600">
                  ฿{order.totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Order Date */}
              <div className="px-6 py-3 text-xs text-gray-500 bg-gray-50 border-t">
                วันที่:{" "}
                {new Date(order.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
            >
              ← ก่อนหน้า
            </Button>
            <span className="text-gray-600">
              หน้า {currentPage} จาก {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              ถัดไป →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
