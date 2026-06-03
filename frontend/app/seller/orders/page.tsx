"use client";

import { useState } from "react";
import { Search, MapPin, Phone, Filter, Download } from "lucide-react";

export default function SellerOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const orders = [
    {
      id: "ORD-001",
      customer: "สมชาย สุดหล่อ",
      product: "เนื้อวากิวคัดพิเศษ",
      amount: "฿899",
      quantity: 1,
      status: "completed",
      date: "2026-06-01",
      address: "123 ถนนพหลโยธิน กรุงเทพ",
      phone: "089-xxx-xxxx",
    },
    {
      id: "ORD-002",
      customer: "ศรีลักษณ์ ใจดี",
      product: "เนื้อสันนอก",
      amount: "฿699",
      quantity: 2,
      status: "pending",
      date: "2026-06-02",
      address: "456 ถนนสุขุมวิท นนทบุรี",
      phone: "089-yyy-yyyy",
    },
    {
      id: "ORD-003",
      customer: "ปิยะ อ่อนมาก",
      product: "เนื้อบด",
      amount: "฿1,197",
      quantity: 3,
      status: "completed",
      date: "2026-05-31",
      address: "789 ถนนนวลจันทร์ ปทุมธานี",
      phone: "088-zzz-zzzz",
    },
    {
      id: "ORD-004",
      customer: "เอกพล สายเนื้อ",
      product: "เนื้อสันใน",
      amount: "฿1,598",
      quantity: 2,
      status: "processing",
      date: "2026-06-02",
      address: "321 ถนนเจริงนครสวรรค์",
      phone: "089-aaa-aaaa",
    },
    {
      id: "ORD-005",
      customer: "นฤมล คนหิว",
      product: "เนื้อวากิวคัดพิเศษ",
      amount: "฿2,697",
      quantity: 3,
      status: "pending",
      date: "2026-06-02",
      address: "654 ถนนพระราม 4 กรุงเทพ",
      phone: "087-bbb-bbbb",
    },
    {
      id: "ORD-006",
      customer: "กานต์เดช หล่นะ",
      product: "เนื้อนวล",
      amount: "฿898",
      quantity: 2,
      status: "shipped",
      date: "2026-06-01",
      address: "987 ถนนสาทร กรุงเทพ",
      phone: "089-ccc-cccc",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      completed: "เสร็จสิ้น",
      pending: "รอดำเนินการ",
      processing: "กำลังจัดเตรียม",
      shipped: "จัดส่งแล้ว",
    };
    return labels[status] || status;
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length.toString(),
      color: "text-[#4E0707]",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "pending").length.toString(),
      color: "text-yellow-600",
    },
    {
      label: "Processing",
      value: orders.filter((o) => o.status === "processing").length.toString(),
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "completed").length.toString(),
      color: "text-green-600",
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#B4915B] hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Order Info */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-bold text-[#4E0707]">{order.id}</p>
              </div>

              {/* Product Info */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Product</p>
                <p className="font-semibold text-[#4E0707]">{order.product}</p>
                <p className="text-xs text-gray-600">Qty: {order.quantity}</p>
              </div>

              {/* Amount */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="text-lg font-bold text-[#B4915B]">
                  {order.amount}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(
                      order.status,
                    )}`}
                  >
                    {getStatusLabel(order.status)}
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
                    {order.customer}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#B4915B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-sm text-[#4E0707]">{order.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#B4915B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="text-sm text-[#4E0707]">{order.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2 justify-end">
              <button className="px-4 py-2 border border-[#B4915B] text-[#B4915B] rounded-lg hover:bg-[#B4915B]/10 transition-colors font-semibold text-sm">
                View Details
              </button>
              {order.status === "pending" && (
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold text-sm">
                  Confirm & Prepare
                </button>
              )}
              {order.status === "processing" && (
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold text-sm">
                  Mark as Shipped
                </button>
              )}
            </div>

            {/* Date */}
            <p className="text-xs text-gray-500 mt-3">
              Order Date: {new Date(order.date).toLocaleDateString("th-TH")}
            </p>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      )}
    </div>
  );
}
