"use client";
import { fetchApi } from "@/lib/api";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function SettingsPage() {
  const [gpPercentage, setGpPercentage] = useState<string>("10");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetchApi(`/settings/gp`, {
      
        
      });
      if (res.ok) {
        const data = await res.json();
        setGpPercentage(data.percentage.toString());
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("ดึงข้อมูลตั้งค่าล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const val = parseFloat(gpPercentage);
    if (isNaN(val) || val < 0 || val > 100) {
      toast.error("กรุณาระบุเปอร์เซ็นต์ระหว่าง 0 - 100");
      return;
    }

    try {
      setSaving(true);
      const res = await fetchApi(`/settings/gp`, {
      
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ percentage: val }),
      });

      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      toast.success("บันทึกการตั้งค่าระบบเรียบร้อยแล้ว");
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4E0707] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            ตั้งค่าระบบ
          </h2>
          <p className="text-sm text-gray-500">
            จัดการค่าธรรมเนียมและส่วนแบ่งรายได้ (Platform Fee / GP)
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            ค่าธรรมเนียมแพลตฟอร์ม (GP)
          </h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                ค่าธรรมเนียมนี้จะถูกหักออกจาก<strong>ยอดรวมค่าสินค้า</strong>ของทุกออเดอร์ เมื่อแอดมินทำการอนุมัติสลิปโอนเงิน (Verified) และรายได้ส่วนนี้จะตกเป็นของเว็บไซต์
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gp-percentage" className="font-medium">
                ส่วนแบ่ง GP (%)
              </Label>
              <div className="relative">
                <Input
                  id="gp-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={gpPercentage}
                  onChange={(e) => setGpPercentage(e.target.value)}
                  className="pl-4 pr-10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#4E0707] hover:bg-[#3d0505] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
