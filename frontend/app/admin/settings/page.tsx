"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "SmartButcher Marketplace",
    storeEmail: "admin@smartbutcher.com",
    storePhone: "+66-9-1234-5678",
    storeAddress: "123 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพ",
    description: "ตลาดเนื้อสัตว์คุณภาพสูงของไทย",
    currency: "THB",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage("ไฟล์ถูกบันทึกเรียบร้อยแล้ว");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">ตั้งค่าระบบ</h1>
        <p className="text-muted-foreground">จัดการข้อมูลทั่วไปของร้านค้า</p>
      </div>

      {saveMessage && (
        <div className="bg-green-100 border border-green-300 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              ข้อมูลพื้นฐาน
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName" className="mb-2 block">
                  ชื่อร้านค้า
                </Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="storeEmail" className="mb-2 block">
                  อีเมล
                </Label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="storePhone" className="mb-2 block">
                  เบอร์โทรศัพท์
                </Label>
                <Input
                  id="storePhone"
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="storeAddress" className="mb-2 block">
                  ที่อยู่
                </Label>
                <Textarea
                  id="storeAddress"
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">
                  คำอธิบายร้านค้า
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={settings.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </Button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Currency Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">สกุลเงิน</h3>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="THB">บาทไทย (฿)</option>
              <option value="USD">ดอลลาร์สหรัฐ ($)</option>
              <option value="EUR">ยูโร (€)</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-accent/5 border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">
              ข้อมูลช่วยเหลือ
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• ตั้งค่าข้อมูลทั่วไปของร้านค้าของคุณ</li>
              <li>• ข้อมูลนี้จะแสดงในทั้งเว็บไซต์</li>
              <li>• อัพเดตเบอร์โทรศัพท์และอีเมลให้เป็นปัจจุบัน</li>
              <li>• บันทึกการเปลี่ยนแปลงเมื่อคุณสำเร็จแล้ว</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
