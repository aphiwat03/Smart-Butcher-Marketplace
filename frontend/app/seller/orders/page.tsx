"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";
import {
  Search,
  MapPin,
  Phone,
  Filter,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  shippingAddressText: string;
  shippingPhone: string;
  user: {
    fullName: string;
  };
  orderItems: OrderItem[];
}

interface AuthMeResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  store?: {
    id: number;
    ownerUserId: number;
    [key: string]: unknown;
  };
}

const formatCurrency = (value: number) => `฿${value.toLocaleString()}`;

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const authHeaders: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const meRes = await fetch(`${API_URL}/auth/me`, {
          headers: authHeaders,
        });

        if (!meRes.ok) {
          throw new Error(`Failed to load user (${meRes.status})`);
        }

        const me: AuthMeResponse = await meRes.json();
        const storeId = me.store?.id;

        if (!storeId) {
          throw new Error("ไม่พบร้านค้าของผู้ใช้นี้");
        }

        const res = await fetch(`${API_URL}/stores/${storeId}/orders`, {
          headers: authHeaders,
        });

        if (!res.ok) {
          throw new Error(`Failed to load orders (${res.status})`);
        }

        const json: Order[] = await res.json();
        setOrders(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ฟังก์ชันแปลงสถานะ PAID ให้กลายเป็น COMPLETED อัตโนมัติใน UI
  const normalizeStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === "paid") return "completed";
    return s;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderIdLabel = `ORD-${order.id}`;
      const productNames = order.orderItems
        .map((item) => item.product.name)
        .join(" ");

      const matchesSearch =
        orderIdLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productNames.toLowerCase().includes(searchTerm.toLowerCase());

      const normalizedOrderStatus = normalizeStatus(order.orderStatus);
      const matchesFilter =
        filterStatus === "all" || normalizedOrderStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus]);

  const getStatusBadge = (status: string) => {
    const normStatus = normalizeStatus(status);
    const styles: { [key: string]: string } = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[normStatus] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const normStatus = normalizeStatus(status);
    const labels: { [key: string]: string } = {
      completed: "เสร็จสิ้น",
      pending: "รอดำเนินการ",
      cancelled: "ยกเลิก",
    };
    return labels[normStatus] || status;
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length.toString(),
      color: "text-[#4E0707]",
    },
    {
      label: "Pending",
      value: orders
        .filter((o) => normalizeStatus(o.orderStatus) === "pending")
        .length.toString(),
      color: "text-yellow-600",
    },
    {
      label: "Completed",
      value: orders
        .filter((o) => normalizeStatus(o.orderStatus) === "completed")
        .length.toString(),
      color: "text-green-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#B4915B] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 mb-1">
            ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้
          </h3>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4E0707] mb-1">My Orders</h1>
          <p className="text-gray-600">Manage customer orders and shipments</p>
        </div>
        <button className="flex items-center gap-2 bg-[#B4915B] hover:bg-[#9A7A48] text-white px-4 py-2 rounded-lg font-semibold transition-colors">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B] bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const totalQuantity = order.orderItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const productLabel =
            order.orderItems.length > 1
              ? `${order.orderItems[0].product.name} +${order.orderItems.length - 1} รายการ`
              : (order.orderItems[0]?.product.name ?? "-");

          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#B4915B] hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Order Info */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-lg font-bold text-[#4E0707]">
                    #ORD-{String(order.id).padStart(4, "0")}
                  </p>
                </div>

                {/* Product Info */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Product</p>
                  <p className="font-semibold text-[#4E0707]">{productLabel}</p>
                  <p className="text-xs text-gray-600">Qty: {totalQuantity}</p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="text-lg font-bold text-[#B4915B]">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(
                        order.orderStatus,
                      )}`}
                    >
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer</p>
                    <p className="font-semibold text-[#4E0707]">
                      {order.user.fullName}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#B4915B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="text-sm text-[#4E0707]">
                        {order.shippingAddressText}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-[#B4915B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="text-sm text-[#4E0707]">
                        {order.shippingPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 justify-end">
                <button className="px-4 py-2 border border-[#B4915B] text-[#B4915B] rounded-lg hover:bg-[#B4915B]/10 transition-colors font-semibold text-sm">
                  View Details
                </button>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-500 mt-3">
                Order Date:{" "}
                {new Date(order.createdAt).toLocaleDateString("th-TH")}
              </p>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      )}
    </div>
  );
}
