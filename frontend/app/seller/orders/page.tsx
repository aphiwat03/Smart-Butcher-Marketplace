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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AuthMeResponse } from "@/types/auth";
import { SellerOrder, SellerOrderItem } from "@/types/seller";

const formatCurrency = (value: number) => `฿${value.toLocaleString()}`;

export default function SellerOrders() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
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

        const json: SellerOrder[] = await res.json();
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

  const normalizeStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === "paid") return "success";
    if (s === "cancelled") return "reject";
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
      success: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      reject: "bg-red-100 text-red-800",
    };
    return styles[normStatus] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const normStatus = normalizeStatus(status);
    const labels: { [key: string]: string } = {
      success: "success",
      pending: "pending",
      reject: "Reject",
    };
    return labels[normStatus] || status;
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "Address",
      "Products",
      "Total Quantity",
      "Total Amount",
      "Status",
      "Order Date",
    ];

    const rows = filteredOrders.map((order) => {
      const orderId = `ORD-${String(order.id).padStart(4, "0")}`;
      const customerName = order.user.fullName || "-";
      const phone = order.shippingPhone || "-";
      const address = order.shippingAddressText || "-";

      const productNames = order.orderItems
        .map((item) => `${item.product.name} (x${item.quantity})`)
        .join(", ");

      const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const amount = order.totalAmount;
      const status = getStatusLabel(order.orderStatus);
      const date = new Date(order.createdAt).toLocaleDateString("th-TH");

      return [
        `"${orderId}"`,
        `"${customerName.replace(/"/g, '""')}"`,
        `"${phone}"`,
        `"${address.replace(/"/g, '""')}"`,
        `"${productNames.replace(/"/g, '""')}"`,
        totalQuantity,
        amount,
        `"${status}"`,
        `"${date}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      label: "Success",
      value: orders
        .filter((o) => normalizeStatus(o.orderStatus) === "success")
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-[#4E0707] mb-1">My Orders</h1>
          <p className="text-sm md:text-base text-gray-600">Manage customer orders and shipments</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-[#B4915B] hover:bg-[#9A7A48] text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition-colors self-start sm:self-auto"
        >
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4915B]/20 focus:border-[#B4915B] transition-all h-[46px]"
          />
        </div>
        <div className="sm:w-64">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full h-[46px] bg-gray-50 border-gray-200 hover:bg-gray-100/50 focus:ring-2 focus:ring-[#B4915B]/20 focus:border-[#B4915B] rounded-lg transition-all text-sm sm:text-base">
              <div className="flex items-center gap-2 text-gray-600">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Select Status" />
              </div>
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" className="max-h-60">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
            </SelectContent>
          </Select>
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
              className="bg-white rounded-lg shadow-sm p-4 md:p-5 border-l-4 border-[#B4915B] hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">
                    Order Date: {new Date(order.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-lg font-bold text-[#4E0707] leading-none">
                    #ORD-{String(order.id).padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadge(
                      order.orderStatus,
                    )}`}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-3">
                {/* Product Info */}
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Product</p>
                  <p className="font-semibold text-gray-800 text-sm">{productLabel}</p>
                  <p className="text-xs text-gray-500">Qty: {totalQuantity}</p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Amount</p>
                  <p className="text-base font-bold text-[#B4915B]">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Customer</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {order.user.fullName}
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B4915B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                      <p className="text-sm text-gray-800">
                        {order.shippingPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B4915B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Address</p>
                      <p className="text-sm text-gray-800 line-clamp-2" title={order.shippingAddressText}>
                        {order.shippingAddressText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
