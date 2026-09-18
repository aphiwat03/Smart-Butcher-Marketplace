"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { fetchApi } from "@/lib/api";
import { AdminDataTable, ColumnDef } from "@/components/admin/admin-data-table";

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

      const response = await fetchApi(`/admin/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      if (Array.isArray(data)) {
        data.sort((a, b) => Number(a.id) - Number(b.id));
      }
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
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      setIsVerifying(true);
      const response = await fetchApi(`/admin/payments/${paymentId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

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
        color:
          "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
        label: "ชำระเงินสำเร็จ",
      },
      PAID: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
        label: "ชำระเงินสำเร็จ",
      },
      PENDING: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
        label: "รอการอนุมัติ",
      },
      PROCESSING: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
        label: "กำลังเตรียมจัดส่ง",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
        label: "ยกเลิกคำสั่งซื้อ",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
        label: "ไม่ผ่านอนุมัติ",
      },
    };

    const config = statusMap[status?.toUpperCase()] || {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      label: status,
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.color}`}
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

  const columns: ColumnDef<any>[] = [
    {
      header: "ID",
      hideOnMobileCard: true,
      className: "w-16",
      cell: (order) => (
        <span className="font-bold text-[#4E0707] dark:text-red-400">
          {order.id}
        </span>
      ),
    },
    {
      header: "ชื่อลูกค้า",
      mobileLabel: "ชื่อลูกค้า",
      className: "w-[150px]",
      cell: (order) => (
        <span className="font-medium text-foreground truncate block">
          {order.user?.fullName || "ไม่ระบุชื่อ"}
        </span>
      ),
    },
    {
      header: "สินค้า",
      mobileLabel: "สินค้า",
      className: "w-[220px]",
      cell: (order) => (
        <span className="text-muted-foreground line-clamp-2">
          {formatItems(order.orderItems)}
        </span>
      ),
    },
    {
      header: "ยอดเงิน",
      mobileLabel: "ยอดเงิน",
      align: "right",
      className: "w-[110px]",
      cell: (order) => (
        <span className="font-bold text-[#B4915B] whitespace-nowrap">
          ฿{order.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "สถานะ",
      mobileLabel: "สถานะ",
      align: "center",
      className: "w-[140px]",
      cell: (order) => {
        const payment = order.payments?.[0];
        return getStatusBadge(
          payment?.status === "REJECTED" ? "REJECTED" : order.orderStatus,
        );
      },
    },
    {
      header: "วันที่",
      mobileLabel: "วันที่",
      align: "center",
      className: "w-[120px] whitespace-nowrap text-muted-foreground",
      cell: (order) => (
        <span className="text-muted-foreground">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
    {
      header: "หลักฐาน",
      align: "center",
      className: "w-[130px]",
      hideOnMobileCard: true,
      cell: (order) => {
        const payment = order.payments?.[0];
        return (
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
                      : "border border-border text-foreground hover:bg-muted"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Eye className="w-4 h-4" />
                {payment?.status === "PENDING"
                  ? "รอตรวจสลิป"
                  : payment?.slipImageUrl
                    ? "ดูสลิป"
                    : "ไม่มีหลักฐาน"}
              </button>
              {payment?.status === "PENDING" && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
              )}
            </div>
          </div>
        );
      },
    },
  ];


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
        <div className="bg-card border-l-4 border-blue-500 shadow-sm rounded-lg p-6 border border-border">
          <p className="text-muted-foreground text-sm mb-1">
            คำสั่งซื้อทั้งหมด
          </p>
          <p className="text-3xl font-bold text-[#4E0707] dark:text-foreground">
            {stats.total}
          </p>
        </div>
        <div className="bg-card border-l-4 border-yellow-500 shadow-sm rounded-lg p-6 border border-border">
          <p className="text-muted-foreground text-sm mb-1">รอตรวจสอบ</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-card border-l-4 border-green-500 shadow-sm rounded-lg p-6 border border-border">
          <p className="text-muted-foreground text-sm mb-1">เสร็จสิ้น</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Shared Responsive Table & Mobile Cards */}
      <AdminDataTable
        data={orders}
        columns={columns}
        keyExtractor={(order) => order.id}
        idExtractor={(order) => order.id}
        isLoading={loading}
        emptyMessage="ยังไม่มีคำสั่งซื้อในระบบ"
        topRightAction={(order) => {
          const payment = order.payments?.[0];
          if (!payment?.slipImageUrl) return null;
          return (
            <button
              type="button"
              onClick={() =>
                setSelectedPayment({
                  id: payment.id,
                  slipUrl: payment.slipImageUrl,
                  status: payment.status,
                })
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors relative"
              title="ดูสลิป"
            >
              <Eye size={15} />
              {payment.status === "PENDING" && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        }}
        bottomAction={(order) => {
          const payment = order.payments?.[0];
          if (!payment?.slipImageUrl) {
            return (
              <div className="w-full mt-1 py-2 text-center text-xs text-muted-foreground bg-muted/40 rounded-lg">
                ไม่มีหลักฐานการชำระเงิน
              </div>
            );
          }
          return (
            <button
              type="button"
              onClick={() =>
                setSelectedPayment({
                  id: payment.id,
                  slipUrl: payment.slipImageUrl,
                  status: payment.status,
                })
              }
              className={`w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                payment.status === "PENDING"
                  ? "bg-[#B4915B] text-white hover:bg-[#9A7A48] shadow-sm"
                  : "border border-border bg-muted/50 text-foreground hover:bg-muted"
              }`}
            >
              <Eye size={14} />
              {payment.status === "PENDING"
                ? "ตรวจสอบสลิปโอนเงิน (รอดำเนินการ)"
                : "ดูสลิปโอนเงิน"}
            </button>
          );
        }}
      />

      {/* Modal ตรวจสอบสลิป */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-card">
              <h3 className="font-bold text-lg text-[#4E0707] dark:text-foreground">
                ตรวจสอบหลักฐานการชำระเงิน
              </h3>
              <button
                onClick={() => !isVerifying && setSelectedPayment(null)}
                disabled={isVerifying}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-full transition-colors disabled:opacity-50"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center bg-muted/30">
              <img
                src={selectedPayment.slipUrl}
                alt="Slip"
                className="max-h-[50vh] object-contain rounded-xl border border-border shadow-sm bg-card p-1"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x600?text=Image+Not+Found";
                }}
              />
            </div>

            <div className="p-5 border-t border-border bg-card">
              {selectedPayment.status === "PENDING" ? (
                <div className="flex gap-3 w-full justify-between">
                  <button
                    onClick={() =>
                      handleVerifyPayment(selectedPayment.id, "REJECTED")
                    }
                    disabled={isVerifying}
                    className="flex-1 bg-card border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:hover:bg-rose-950/40 px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/40 border border-border">
                    <span className="text-sm text-muted-foreground">
                      สถานะปัจจุบัน:
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        selectedPayment.status === "VERIFIED"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {selectedPayment.status === "VERIFIED"
                        ? "อนุมัติแล้ว (VERIFIED)"
                        : "ปฏิเสธแล้ว (REJECTED)"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground px-6 py-2.5 rounded-xl font-semibold transition-colors"
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
