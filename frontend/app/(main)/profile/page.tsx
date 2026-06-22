"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/profile";
import { API_URL } from "@/lib/api";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch User Info
      const userRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const userData = await userRes.json();

      // Fetch Default Address
      const addressRes = await fetch(`${API_URL}/users/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addresses = addressRes.ok ? await addressRes.json() : [];
      const defaultAddress = addresses.length > 0 ? addresses[0] : null;

      const loadedProfile: UserProfile = {
        id: userData.userId || userData.id,
        fullName: userData.fullName || "",
        email: userData.email || "",
        addressId: defaultAddress?.id,
        receiverName: defaultAddress?.receiverName || "",
        phone: defaultAddress?.phoneNumber || "",
        addressLine: defaultAddress?.addressLine || "",
        city: defaultAddress?.city || "",
        postalCode: defaultAddress?.postalCode || "",
      };

      setProfile(loadedProfile);
      setFormData(loadedProfile);
    } catch (error) {
      console.error(error);
      toast.error("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token");

      // Update Profile (Name & Email)
      const profileRes = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
        }),
      });

      if (!profileRes.ok) {
        const errorData = await profileRes.json();
        throw new Error(errorData.message || "อัปเดตโปรไฟล์ไม่สำเร็จ");
      }

      // Update or Create Address
      const addressPayload = {
        title: "ที่อยู่จัดส่งเริ่มต้น",
        receiverName: formData.receiverName,
        phoneNumber: formData.phone,
        addressLine: formData.addressLine,
        city: formData.city,
        postalCode: formData.postalCode,
        isDefault: true,
      };

      let addressRes;
      if (formData.addressId) {
        // Update existing address
        addressRes = await fetch(`${API_URL}/users/address/${formData.addressId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressPayload),
        });
      } else {
        // Create new address
        addressRes = await fetch(`${API_URL}/users/address`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressPayload),
        });
      }

      if (!addressRes.ok) {
        throw new Error("อัปเดตที่อยู่ไม่สำเร็จ");
      }

      await fetchProfileData(); // Reload data
      setIsEditing(false);
      toast.success("บันทึกข้อมูลและตั้งค่าที่อยู่เริ่มต้นสำเร็จ");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#4E0707]">โปรไฟล์ของฉัน</h1>
            <p className="text-gray-600 mt-2">
              จัดการข้อมูลส่วนตัวและที่อยู่จัดส่งเริ่มต้นของคุณ
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#B4915B] text-white hover:bg-[#8e7042] transition-colors"
            >
              แก้ไขข้อมูล
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Account Info Card */}
          <Card className="bg-white p-6 border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              ข้อมูลบัญชี
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-2">
                  ชื่อผู้ใช้งาน
                </Label>
                {isEditing ? (
                  <Input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full focus-visible:ring-[#B4915B]"
                    placeholder="ชื่อของคุณ"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-md text-gray-900 font-medium">
                    {profile.fullName || "-"}
                  </div>
                )}
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-2">
                  อีเมล
                </Label>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full focus-visible:ring-[#B4915B]"
                    placeholder="อีเมลของคุณ"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-md text-gray-900 font-medium">
                    {profile.email || "-"}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Shipping Address Card */}
          <Card className="bg-white p-6 border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-lg font-bold text-gray-800">ที่อยู่จัดส่งเริ่มต้น (Default)</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                ใช้สำหรับสั่งซื้อสินค้า
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-2">
                  ชื่อผู้รับ
                </Label>
                {isEditing ? (
                  <Input
                    name="receiverName"
                    type="text"
                    value={formData.receiverName || ""}
                    onChange={handleInputChange}
                    className="w-full focus-visible:ring-[#B4915B]"
                    placeholder="ชื่อผู้รับสินค้า"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-md text-gray-900 font-medium">
                    {profile.receiverName || "-"}
                  </div>
                )}
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-2">
                  เบอร์โทรศัพท์
                </Label>
                {isEditing ? (
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full focus-visible:ring-[#B4915B]"
                    placeholder="เบอร์โทรศัพท์"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-md text-gray-900 font-medium">
                    {profile.phone || "-"}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="block text-sm font-medium text-gray-600 mb-2">
                  ที่อยู่ (บ้านเลขที่, ซอย, ถนน)
                </Label>
                {isEditing ? (
                  <Input
                    name="addressLine"
                    type="text"
                    value={formData.addressLine || ""}
                    onChange={handleInputChange}
                    className="w-full focus-visible:ring-[#B4915B]"
                    placeholder="รายละเอียดที่อยู่"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-md text-gray-900 font-medium">
                    {profile.addressLine || "-"}
                  </div>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-2">
                  จังหวัด/อำเภอ
                </Label>
                {isEditing ? (
                  <Input
                    name="city"
                    type="text"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    className="w-full focus-visible:ring-[#B4915B]"
                    placeholder="จังหวัด/อำเภอ"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-md text-gray-900 font-medium">
                    {profile.city || "-"}
                  </div>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-600 mb-2">
                  รหัสไปรษณีย์
                </Label>
                {isEditing ? (
                  <Input
                    name="postalCode"
                    type="text"
                    value={formData.postalCode || ""}
                    onChange={handleInputChange}
                    className="w-full focus-visible:ring-[#B4915B]"
                    placeholder="รหัสไปรษณีย์"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-md text-gray-900 font-medium">
                    {profile.postalCode || "-"}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-4 justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="px-8 bg-[#4E0707] text-white hover:bg-[#3D0505] transition-colors disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
