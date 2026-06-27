"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<{
    id: number;
    slipUrl: string;
    status: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

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
    const result = await Swal.fire({
      title: "ยืนยันการดำเนินการ",
      text: `คุณแน่ใจหรือไม่ว่าต้องการ ${actionText} สลิปนี้?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "VERIFIED" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก"
    });
    
    if (!result.isConfirmed) return;

    try {
      setIsVerifying(true);
      const token = localStorage.getItem("accessToken");
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
        toast.success(`${actionText}สลิปสำเร็จ`);
        setSelectedPayment(null);
        fetchOrders();
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsVerifying(false);
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
      VERIFIED: {
        color: "bg-green-100 text-green-800",
        label: "ชำระเงินสำเร็จ",
      },
      PAID: {
        color: "bg-green-100 text-green-800",
        label: "ชำระเงินสำเร็จ",
      },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        label: "รอการอนุมัติ",
      },
      PROCESSING: {
        color: "bg-purple-100 text-purple-800",
        label: "กำลังเตรียมจัดส่ง",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        label: "ยกเลิกคำสั่งซื้อ",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800",
        label: "ไม่ผ่านอนุมัติ",
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
    completed: orders.filter((o) => o.orderStatus === "PAID").length,
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
                        <div className="flex items-center justify-center">
                          <div className="relative inline-block">
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
                              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium ${
                                payment?.slipImageUrl
                                  ? payment?.status === "PENDING"
                                    ? "bg-[#B4915B] text-white hover:bg-[#9A7A48] shadow-sm"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                              {payment?.status === "PENDING" ? "รอตรวจสลิป" : payment?.slipImageUrl ? "ดูสลิป" : "ไม่มีหลักฐาน"}
                            </button>
                            {payment?.status === "PENDING" && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                              </span>
                            )}
                          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-[#4E0707]">ตรวจสอบหลักฐานการชำระเงิน</h3>
              <button
                onClick={() => !isVerifying && setSelectedPayment(null)}
                disabled={isVerifying}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors disabled:opacity-50"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center bg-slate-50">
              <img
                src={selectedPayment.slipUrl}
                alt="Slip"
                className="max-h-[50vh] object-contain rounded-xl border border-gray-200 shadow-sm bg-white p-1"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x600?text=Image+Not+Found";
                }}
              />
            </div>

            <div className="p-5 border-t border-gray-100 bg-white">
              {selectedPayment.status === "PENDING" ? (
                <div className="flex gap-3 w-full justify-between">
                  <button
                    onClick={() =>
                      handleVerifyPayment(selectedPayment.id, "REJECTED")
                    }
                    disabled={isVerifying}
                    className="flex-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    ปฏิเสธสลิป
                  </button>
                  <button
                    onClick={() =>
                      handleVerifyPayment(selectedPayment.id, "VERIFIED")
                    }
                    disabled={isVerifying}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {isVerifying ? "กำลังประมวลผล..." : "อนุมัติสลิป"}
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-sm text-gray-500">สถานะปัจจุบัน:</span>
                    <span className={`text-sm font-bold ${selectedPayment.status === "VERIFIED" ? "text-emerald-600" : "text-rose-600"}`}>
                      {selectedPayment.status === "VERIFIED" ? "อนุมัติแล้ว (VERIFIED)" : "ปฏิเสธแล้ว (REJECTED)"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-xl font-semibold transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
