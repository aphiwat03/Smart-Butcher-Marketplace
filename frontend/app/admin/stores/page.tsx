"use client";

import { useEffect, useState } from "react";
import { Ban, Store as StoreIcon, AlertCircle } from "lucide-react";

interface StoreItem {
  id: number;
  name: string;
  ownerName: string;
  createdAt: string;
  status: "OPEN" | "CLOSED" | "SUSPENDED";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: StoreItem["status"] }) {
  const config = {
    OPEN: {
      label: "เปิดใช้งาน",
      className:
        "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    },
    CLOSED: {
      label: "ปิดร้าน",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
    SUSPENDED: {
      label: "ถูกระงับ",
      className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    },
  }[status];

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<number | null>(null);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(`${API_URL}/admin/stores`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`ไม่สามารถโหลดรายชื่อร้านค้าได้ (${res.status})`);
      }

      const json: StoreItem[] = await res.json();
      setStores(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSuspend = async (store: StoreItem) => {
    const confirmed = window.confirm(
      `ยืนยันการระงับการใช้งานร้าน "${store.name}" ใช่หรือไม่?`,
    );
    if (!confirmed) return;

    try {
      setSuspendingId(store.id);

      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(`${API_URL}/admin/stores/${store.id}/suspend`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`ไม่สามารถระงับร้านค้าได้ (${res.status})`);
      }

      setStores((prev) =>
        prev.map((s) =>
          s.id === store.id ? { ...s, status: "SUSPENDED" } : s,
        ),
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      );
    } finally {
      setSuspendingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mx-4 -mt-14 lg:-mx-6 lg:-mt-6 bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4 pt-14 lg:pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#4E0707] mb-1 md:mb-2">
            จัดการร้านค้า
          </h1>
          <p className="text-sm md:text-base text-gray-500">รายชื่อร้านค้าทั้งหมดในระบบ</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  ID
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  ชื่อร้าน
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  เจ้าของร้าน
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  วันที่สร้าง
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground text-right">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-5 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : stores.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <StoreIcon size={28} className="text-muted-foreground" />
                      ยังไม่มีร้านค้าในระบบ
                    </div>
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr
                    key={store.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      #{store.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {store.ownerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(store.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={store.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {store.status === "SUSPENDED" ? (
                        <span className="text-xs text-muted-foreground">
                          ระงับแล้ว
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSuspend(store)}
                          disabled={suspendingId === store.id}
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-red-950 dark:text-red-300 dark:border-red-900"
                        >
                          <Ban size={14} />
                          {suspendingId === store.id
                            ? "กำลังระงับ..."
                            : "ระงับการใช้งาน"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
