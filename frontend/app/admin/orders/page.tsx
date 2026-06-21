"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<{
    id: number;
    slipUrl: string;
    status: string;
  } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_URL}/admin/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("order: ", response);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleVerifyPayment = async (
    paymentId: number,
    status: "VERIFIED" | "REJECTED",
  ) => {
    const actionText = status === "VERIFIED" ? "อนุมัติ" : "ปฏิเสธ";
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการ ${actionText} สลิปนี้?`)) return;

    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token:", token);
      console.log("Payment ID:", paymentId);
      console.log("Status to update:", status);
      const response = await fetch(
        `${API_URL}/admin/payments/${paymentId}/verify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        alert(`${actionText}สลิปสำเร็จ`);
        setSelectedPayment(null);
        console.log("ข้อมูลใน selectedPayment คือ:", selectedPayment);
        fetchOrders();
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  const formatItems = (orderItems: any[]) => {
    if (!orderItems || orderItems.length === 0) return "-";
    return orderItems
      .map((item) => `${item.product?.name} × ${item.quantity}`)
      .join(", ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      VERIFIED: { color: "bg-green-100 text-green-800", label: "เสร็จสิ้น" },
      PAID: { color: "bg-blue-100 text-blue-800", label: "ชำระเงินแล้ว" },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        label: "รอชำระเงิน/รอตรวจสอบ",
      },
      PROCESSING: {
        color: "bg-purple-100 text-purple-800",
        label: "กำลังเตรียมจัดส่ง",
      },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "ยกเลิก" },
      REJECTED: {
        color: "bg-red-100 text-red-700 border border-red-200",
        label: "สลิปไม่ผ่าน",
      },
    };

    const config = statusMap[status?.toUpperCase()] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "PENDING").length,
    completed: orders.filter(
      (o) => o.orderStatus === "VERIFIED" || o.orderStatus === "PAID",
    ).length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mx-4 -mt-14 lg:-mx-6 lg:-mt-6 bg-white border-b border-[#B4915B] px-4 py-3 lg:px-8 lg:py-4 pt-14 lg:pt-4 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4E0707] mb-1">
            จัดการคำสั่งซื้อ
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            ตรวจสอบสลิปโอนเงินและอนุมัติคำสั่งซื้อทั้งหมด
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white border-l-4 border-blue-500 shadow-sm rounded-lg p-6">
          <p className="text-gray-500 text-sm mb-1">คำสั่งซื้อทั้งหมด</p>
          <p className="text-3xl font-bold text-[#4E0707]">{stats.total}</p>
        </div>
        <div className="bg-white border-l-4 border-yellow-500 shadow-sm rounded-lg p-6">
          <p className="text-gray-500 text-sm mb-1">รอตรวจสอบ</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white border-l-4 border-green-500 shadow-sm rounded-lg p-6">
          <p className="text-gray-500 text-sm mb-1">เสร็จสิ้น</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              กำลังโหลดข้อมูล...
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#4E0707] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    ชื่อลูกค้า
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    สินค้า
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">
                    ยอดเงิน
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    วันที่
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    หลักฐาน
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => {
                  const payment = order.payments?.[0];

                  return (
                    <tr
                      key={order.id}
                      className={`transition-colors hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-[#4E0707]">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {order.user?.fullName || "ไม่ระบุชื่อ"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatItems(order.orderItems)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-[#B4915B]">
                        ฿{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(
                          payment?.status === "REJECTED"
                            ? "REJECTED"
                            : order.orderStatus,
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setSelectedPayment({
                                id: payment?.id,
                                slipUrl: payment?.slipImageUrl,
                                status: payment?.status,
                              })
                            }
                            disabled={!payment?.slipImageUrl}
                            title="ตรวจสอบสลิป"
                            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                              payment?.slipImageUrl
                                ? "text-blue-600 hover:bg-blue-100 bg-blue-50"
                                : "text-gray-300 cursor-not-allowed bg-gray-50"
                            }`}
                          >
                            <Eye className="w-5 h-5" />
                            {payment?.status === "PENDING" && (
                              <span className="relative flex h-2 w-2 mb-3 -ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีคำสั่งซื้อในระบบ
            </div>
          )}
        </div>
      </div>

      {/* Modal ตรวจสอบสลิป */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-[#4E0707] text-white">
              <h3 className="font-bold text-lg">ตรวจสอบหลักฐานการชำระเงิน</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-300 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 flex flex-col items-center bg-gray-100">
              <img
                src={selectedPayment.slipUrl}
                alt="Slip"
                className="max-h-[50vh] object-contain rounded border border-gray-300 shadow-sm"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x600?text=Image+Not+Found";
                }}
              />
            </div>

            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              {selectedPayment.status === "PENDING" ? (
                <div className="flex gap-2 w-full justify-between">
                  <button
                    onClick={() =>
                      handleVerifyPayment(selectedPayment.id, "REJECTED")
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    ปฏิเสธสลิป
                  </button>
                  <button
                    onClick={() =>
                      handleVerifyPayment(selectedPayment.id, "VERIFIED")
                    }
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    อนุมัติสลิป
                  </button>
                </div>
              ) : (
                <div className="w-full flex justify-between items-center">
                  <div
                    className={`text-sm font-semibold ${selectedPayment.status === "VERIFIED" ? "text-green-600" : "text-red-600"}`}
                  >
                    สถานะปัจจุบัน: {selectedPayment.status}
                  </div>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    ปิด
                  </button>
                </div>
              )}
            </div>

            {selectedPayment.status === "PENDING" && (
              <div className="px-4 pb-4 bg-gray-50 text-center">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium underline"
                >
                  ปิดหน้าต่างโดยยังไม่ดำเนินการ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
