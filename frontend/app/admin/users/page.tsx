"use client";

import { useEffect, useState } from "react";
import {
  KeyRound,
  AlertCircle,
  X,
  Users as UsersIcon,
  CheckCircle2,
  Search,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminDataTable, ColumnDef } from "@/components/admin/admin-data-table";

interface UserItem {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: UserItem["role"] }) {
  const config = {
    ADMIN: {
      label: "แอดมิน",
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    },
    SELLER: {
      label: "ผู้ขาย",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    },
    BUYER: {
      label: "ผู้ซื้อ",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  }[role];

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetchApi(`/admin/users`, {});

      if (!res.ok) {
        throw new Error(`ไม่สามารถโหลดรายชื่อผู้ใช้ได้ (${res.status})`);
      }

      const json: UserItem[] = await res.json();

      const roleOrder: Record<string, number> = {
        ADMIN: 1,
        SELLER: 2,
        BUYER: 3,
      };
      json.sort(
        (a, b) => (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99),
      );

      setUsers(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openPasswordModal = (user: UserItem) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setFormError(null);
  };

  const closePasswordModal = () => {
    setSelectedUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setFormError(null);
    setIsSubmitting(false);
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;

    if (newPassword.length < 8) {
      setFormError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("รหัสผ่านยืนยันไม่ตรงกัน");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const res = await fetchApi(
        `/admin/users/${selectedUser.id}/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        },
      );

      if (!res.ok) {
        throw new Error(`ไม่สามารถเปลี่ยนรหัสผ่านได้ (${res.status})`);
      }

      setSuccessMessage(`เปลี่ยนรหัสผ่านของ ${selectedUser.fullName} สำเร็จ`);
      closePasswordModal();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(u.id).includes(searchTerm),
  );

  const columns: ColumnDef<UserItem>[] = [
    {
      header: "ID",
      hideOnMobileCard: true,
      className: "w-14 text-muted-foreground",
      cell: (user) => <span className="text-muted-foreground">{user.id}</span>,
    },
    {
      header: "ชื่อ-นามสกุล",
      mobileLabel: "ชื่อ-นามสกุล",
      className: "w-[180px]",
      cell: (user) => (
        <span className="font-semibold text-foreground text-sm truncate block">
          {user.fullName}
        </span>
      ),
    },
    {
      header: "อีเมล",
      mobileLabel: "อีเมล",
      className: "w-[220px]",
      cell: (user) => (
        <span className="text-foreground font-medium truncate block">
          {user.email}
        </span>
      ),
    },
    {
      header: "วันที่สมัคร",
      mobileLabel: "วันที่สมัคร",
      className: "w-[110px] whitespace-nowrap text-muted-foreground",
      cell: (user) => (
        <span className="text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      header: "บทบาท",
      mobileLabel: "บทบาท",
      className: "w-[100px]",
      cell: (user) => <RoleBadge role={user.role} />,
    },
    {
      header: "จัดการ",
      align: "right",
      className: "w-[130px]",
      hideOnMobileCard: true,
      cell: (user) => (
        <button
          onClick={() => openPasswordModal(user)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <KeyRound size={14} />
          แก้ไขรหัสผ่าน
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
            จัดการผู้ใช้งาน
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            รายชื่อผู้ใช้งานทั้งหมดในระบบ
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 size={16} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Search Bar matching mockup (Search User) */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search User (ค้นหาชื่อ, อีเมล, บทบาท)..."
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
        data={filteredUsers}
        columns={columns}
        keyExtractor={(user) => user.id}
        idExtractor={(user) => user.id}
        isLoading={isLoading}
        emptyMessage={
          searchTerm
            ? "ไม่พบผู้ใช้งานที่ตรงกับคำค้นหา"
            : "ยังไม่มีผู้ใช้งานในระบบ"
        }
        emptyIcon={<UsersIcon size={28} className="text-muted-foreground" />}
        topRightAction={(user) => (
          <button
            type="button"
            onClick={() => openPasswordModal(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-400 transition-colors"
            title="แก้ไขรหัสผ่าน"
          >
            <KeyRound size={15} />
          </button>
        )}
        bottomAction={(user) => (
          <button
            type="button"
            onClick={() => openPasswordModal(user)}
            className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-blue-200 bg-blue-50/80 text-blue-600 hover:bg-blue-100 text-xs font-semibold dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300 transition-colors"
          >
            <KeyRound size={14} />
            แก้ไขรหัสผ่าน
          </button>
        )}
      />

      {/* Change Password Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-card border border-border shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-lg font-bold text-foreground">
                แก้ไขรหัสผ่าน
              </h3>
              <button
                onClick={closePasswordModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">ผู้ใช้</p>
                <p className="font-medium text-foreground">
                  {selectedUser.fullName}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({selectedUser.email})
                  </span>
                </p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-foreground mb-1.5">
                  รหัสผ่านใหม่
                </Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="bg-background"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-foreground mb-1.5">
                  ยืนยันรหัสผ่านใหม่
                </Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  className="bg-background"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleChangePassword();
                  }}
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <button
                onClick={closePasswordModal}
                disabled={isSubmitting}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isSubmitting}
                className="rounded-md bg-[#4E0707] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
