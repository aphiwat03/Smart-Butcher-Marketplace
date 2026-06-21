"use client";

import { useEffect, useState } from "react";
import {
  KeyRound,
  AlertCircle,
  X,
  Users as UsersIcon,
  CheckCircle2,
} from "lucide-react";
import { API_URL } from "@/lib/api";

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

      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`ไม่สามารถโหลดรายชื่อผู้ใช้ได้ (${res.status})`);
      }

      const json: UserItem[] = await res.json();
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

      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        `${API_URL}/admin/users/${selectedUser.id}/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mx-4 -mt-14 lg:-mx-6 lg:-mt-6 bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4 pt-14 lg:pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#4E0707] mb-1 md:mb-2">
            จัดการผู้ใช้งาน
          </h1>
          <p className="text-sm md:text-base text-gray-500">รายชื่อผู้ใช้งานทั้งหมดในระบบ</p>
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

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  ID
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  อีเมล
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  ชื่อ-นามสกุล
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  วันที่สมัคร
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                  บทบาท
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
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon size={28} className="text-muted-foreground" />
                      ยังไม่มีผู้ใช้งานในระบบ
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openPasswordModal(user)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <KeyRound size={14} />
                        แก้ไขรหัสผ่าน
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
