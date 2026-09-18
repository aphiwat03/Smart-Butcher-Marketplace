"use client";

import { useEffect, useState } from "react";
import { Ban, Store as StoreIcon, AlertCircle, Search } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { AdminDataTable, ColumnDef } from "@/components/admin/admin-data-table";

interface StoreItem {
  id: number;
  name: string;
  ownerName: string;
  createdAt: string;
  status: "OPEN" | "CLOSED" | "SUSPENDED";
}

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<number | null>(null);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi(`/admin/stores`, {});

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
    const result = await Swal.fire({
      title: "ยืนยันการระงับ",
      text: `ยืนยันการระงับการใช้งานร้าน "${store.name}" ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ระงับการใช้งาน",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      setSuspendingId(store.id);

      const res = await fetchApi(`/admin/stores/${store.id}/suspend`, {
        method: "PATCH",
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
      toast.error(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      );
    } finally {
      setSuspendingId(null);
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.id).includes(searchTerm),
  );

  const columns: ColumnDef<StoreItem>[] = [
    {
      header: "ID",
      hideOnMobileCard: true,
      className: "w-16 text-muted-foreground",
      cell: (store) => <span className="text-muted-foreground">{store.id}</span>,
    },
    {
      header: "ชื่อร้าน",
      mobileLabel: "ชื่อร้าน",
      cell: (store) => (
        <span className="font-semibold text-foreground text-sm truncate">
          {store.name}
        </span>
      ),
    },
    {
      header: "เจ้าของร้าน",
      mobileLabel: "เจ้าของร้าน",
      cell: (store) => (
        <span className="text-foreground font-medium">{store.ownerName}</span>
      ),
    },
    {
      header: "วันที่สร้าง",
      mobileLabel: "วันที่สร้าง",
      className: "text-muted-foreground",
      cell: (store) => (
        <span className="text-muted-foreground">
          {formatDate(store.createdAt)}
        </span>
      ),
    },
    {
      header: "สถานะ",
      mobileLabel: "สถานะ",
      cell: (store) => <StatusBadge status={store.status} />,
    },
    {
      header: "จัดการ",
      align: "right",
      hideOnMobileCard: true,
      cell: (store) =>
        store.status === "SUSPENDED" ? (
          <span className="text-xs text-muted-foreground">ระงับแล้ว</span>
        ) : (
          <button
            onClick={() => handleSuspend(store)}
            disabled={suspendingId === store.id}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-red-950 dark:text-red-300 dark:border-red-900"
          >
            <Ban size={14} />
            {suspendingId === store.id ? "กำลังระงับ..." : "ระงับการใช้งาน"}
          </button>
        ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mx-4 -mt-14 lg:-mx-6 lg:-mt-6 bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4 pt-14 lg:pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#4E0707] mb-1 md:mb-2">
            จัดการร้านค้า
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            รายชื่อร้านค้าทั้งหมดในระบบ
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Search Bar matching mockup */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            placeholder="ค้นหาชื่อร้าน, เจ้าของร้าน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            ล้าง
          </button>
        )}
      </div>

      {/* Shared Responsive Table & Mobile Cards */}
      <AdminDataTable
        data={filteredStores}
        columns={columns}
        keyExtractor={(store) => store.id}
        idExtractor={(store) => store.id}
        isLoading={isLoading}
        emptyMessage={
          searchTerm
            ? "ไม่พบร้านค้าที่ตรงกับคำค้นหา"
            : "ยังไม่มีร้านค้าในระบบ"
        }
        emptyIcon={<StoreIcon size={28} className="text-muted-foreground" />}
        topRightAction={(store) =>
          store.status !== "SUSPENDED" ? (
            <button
              type="button"
              onClick={() => handleSuspend(store)}
              disabled={suspendingId === store.id}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-400 disabled:opacity-50 transition-colors"
              title="ระงับการใช้งาน"
            >
              <Ban size={15} />
            </button>
          ) : (
            <span className="px-2 py-0.5 text-xs text-muted-foreground bg-muted rounded-md">
              ระงับแล้ว
            </span>
          )
        }
        bottomAction={(store) =>
          store.status === "SUSPENDED" ? (
            <div className="w-full mt-1 py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/40 rounded-lg">
              ร้านค้าถูกระงับการใช้งานแล้ว
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleSuspend(store)}
              disabled={suspendingId === store.id}
              className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-red-200 bg-red-50/70 text-red-600 hover:bg-red-100 text-xs font-semibold dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300 disabled:opacity-50 transition-colors"
            >
              <Ban size={14} />
              {suspendingId === store.id ? "กำลังระงับ..." : "ระงับการใช้งาน"}
            </button>
          )
        }
      />
    </div>
  );
}
