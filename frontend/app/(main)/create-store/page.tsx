"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { Store, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CreateStorePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("กรุณาล็อกอินก่อนทำการเปิดร้านค้า");
      }

      const response = await fetch(`${API_URL}/users/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "เกิดข้อผิดพลาดในการสร้างร้านค้า");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/seller");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center p-6 w-full">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-md w-full animate-[fadeUp_0.4s_ease_both]">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#4E0707] mb-2">
            ยินดีต้อนรับ!
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            ระบบได้สร้างร้าน <strong>{name}</strong> ของคุณเรียบร้อยแล้ว <br />
            กำลังพาท่านเข้าสู่ระบบจัดการร้านค้า...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#2c2c2c] antialiased w-full flex items-center justify-center py-12 px-6">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4E0707] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4E0707]/20">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#4E0707]">
            เปิดร้านค้าของคุณ
          </h1>
          <p className="text-gray-500 mt-3 text-sm max-w-sm mx-auto leading-relaxed">
            เริ่มต้นธุรกิจขายเนื้อคุณภาพของคุณบนแพลตฟอร์ม Smart Butcher ได้ฟรี
            ไม่มีค่าธรรมเนียมแรกเข้า
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="name" className="text-sm font-bold text-gray-700">
                ชื่อร้านค้า <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น Smart Butcher Shop"
                required
                disabled={isLoading}
                maxLength={50}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-[#fafaf8] focus:bg-white focus:outline-none focus:border-[#4E0707] focus:ring-1 focus:ring-[#4E0707] transition-all disabled:opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">
                ตั้งชื่อร้านให้โดดเด่นและจดจำง่าย (สูงสุด 50 ตัวอักษร)
              </p>
            </div>

            {/* Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="description"
                className="text-sm font-bold text-gray-700"
              >
                รายละเอียดร้านค้า (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายจุดเด่นของเนื้อที่ร้านคุณ หรือเรื่องราวของร้าน..."
                rows={4}
                disabled={isLoading}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-[#fafaf8] focus:bg-white focus:outline-none focus:border-[#4E0707] focus:ring-1 focus:ring-[#4E0707] transition-all disabled:opacity-50 resize-none"
              />
            </div>

            <hr className="border-gray-100 my-2" />

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors text-center order-2 sm:order-1"
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl text-sm font-bold transition-all order-1 sm:order-2 flex items-center justify-center gap-2 ${
                  isLoading || !name.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#4E0707] hover:bg-[#3D0505] text-white shadow-md shadow-[#4E0707]/10 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังสร้างร้าน...
                  </>
                ) : (
                  "ลงทะเบียนเปิดร้านค้า"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
