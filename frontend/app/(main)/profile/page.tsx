"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
}

export default function ProfilePage() {
  // Mock initial data
  const [profile, setProfile] = useState<UserProfile>({
    id: 1,
    fullName: "สมชาย ใจดี",
    email: "somchai@example.com",
    avatar: "/mock/category/วากิวคัดพิเศษ.webp",
    phone: "089-123-4567",
    address: "123 ถนนประเทศไทย กรุงเทพ",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      // Mock API call - simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update profile with form data
      setProfile(formData);
      setIsEditing(false);
      setMessage({ type: "success", text: "บันทึกข้อมูลสำเร็จ" });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
          <p className="text-gray-600 mt-2">
            จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <Card className="bg-white p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left - Avatar Section */}
            <div className="flex flex-col items-center md:col-span-1">
              <div className="relative mb-6">
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-red-200"
                />
              </div>

              {isEditing && (
                <label className="cursor-pointer">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-center">
                    เปลี่ยนรูป
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Right - Form Section */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ชื่อเต็ม
                  </Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="กรุณากรอกชื่อเต็ม"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile.fullName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    อีเมล
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="กรุณากรอกอีเมล"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    เบอร์โทรศัพท์
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="กรุณากรอกเบอร์โทรศัพท์"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile.phone || "-"}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <Label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ที่อยู่
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="กรุณากรอกที่อยู่"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile.address || "-"}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  {!isEditing ? (
                    <Button
                      onClick={() => {
                        setFormData(profile);
                        setIsEditing(true);
                      }}
                      className="flex-1 bg-red-600 text-white hover:bg-red-700 py-2 rounded-lg transition-colors"
                    >
                      แก้ไขข้อมูล
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-green-600 text-white hover:bg-green-700 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loading ? "กำลังบันทึก..." : "บันทึก"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="flex-1 bg-gray-400 text-white hover:bg-gray-500 py-2 rounded-lg transition-colors"
                      >
                        ยกเลิก
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 หมายเหตุ</h3>
          <p className="text-blue-800 text-sm">
            นี่คือเวอร์ชัน Mock สำหรับการทดสอบ
            ข้อมูลจะไม่ถูกบันทึกลงฐานข้อมูลจริง
          </p>
        </div>
      </div>
    </div>
  );
}
