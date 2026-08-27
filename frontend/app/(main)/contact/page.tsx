"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/api";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetchApi('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.mobile,
          message: form.message,
        })
      });

      if (response.ok) {
        setSent(true);
        toast.success("ส่งข้อความสำเร็จ");
      } else {
        toast.error("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#2c2c2c] antialiased w-full">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#4E0707] mb-1">ติดต่อเรา</h1>
          <p className="text-sm text-gray-400">
            มีคำถามหรือข้อสงสัย? เราพร้อมตอบทุกเรื่อง
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left — Contact Form */}
          <div className="border border-gray-200 rounded-xl bg-white p-6 flex flex-col">
            <p className="text-sm font-bold text-[#4E0707] mb-5">
              ส่งข้อความหาเรา
            </p>

            {sent ? (
              <div className="flex flex-1 flex-col items-center justify-center py-12 gap-3 text-center h-full min-h-[300px]">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <CircleCheck size={28} className="text-green-600" />
                </div>
                <p className="font-bold text-gray-700">
                  ส่งข้อความเรียบร้อยแล้ว
                </p>
                <p className="text-sm text-gray-400">
                  ทีมงานจะติดต่อกลับหาคุณโดยเร็วที่สุด
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({
                      firstName: "",
                      lastName: "",
                      mobile: "",
                      email: "",
                      message: "",
                    });
                  }}
                  className="mt-2 text-sm text-[#4E0707] hover:underline"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="ชื่อ (First name)" required>
                    <Input
                      type="text"
                      placeholder="ชื่อ"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="นามสกุล (Last name)" required>
                    <Input
                      type="text"
                      placeholder="นามสกุล"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      required
                    />
                  </Field>
                </div>

                <Field label="เบอร์มือถือ" required>
                  <Input
                    type="tel"
                    placeholder="081-234-5678"
                    value={form.mobile}
                    onChange={(e) =>
                      set(
                        "mobile",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    maxLength={10}
                    minLength={10}
                    pattern="[0-9]{10}"
                    title="กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"
                    required
                  />
                </Field>

                <Field label="อีเมล" required>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                  />
                </Field>

                <Field label="ข้อความ" required>
                  <Textarea
                    rows={5}
                    placeholder="บอกเราว่าคุณสนใจอะไร หรือต้องการความช่วยเหลือเรื่องใด..."
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    className="resize-none leading-relaxed"
                    required
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "กำลังส่งข้อความ..." : "ส่งข้อความ"}
                </button>
              </form>
            )}
          </div>

          {/* Right — Info cards */}
          <div className="flex flex-col gap-4">
            {/* Contact channels */}
            <div className="border border-gray-200 rounded-xl bg-white p-5">
              <p className="text-sm font-bold text-[#4E0707] mb-4">
                ช่องทางติดต่ออื่นๆ
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: <Phone size={15} />,
                    label: "โทรศัพท์",
                    value: "02-987-6543",
                  },
                  {
                    icon: <Mail size={15} />,
                    label: "อีเมล",
                    value: "contact@smartbutcher.co.th",
                  },
                  {
                    icon: <Phone size={15} />,
                    label: "Line Official",
                    value: "@smartbutcher.th",
                  },
                ].map(({ icon, label, value }, i) => (
                  <div key={label}>
                    {i > 0 && <div className="border-t border-gray-100 mb-3" />}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FDF6EE] border border-[#EF9F27]/40 flex items-center justify-center text-[#854F0B] flex-shrink-0">
                        {icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="border border-gray-200 rounded-xl bg-white p-5">
              <p className="text-sm font-bold text-[#4E0707] mb-4">เวลาทำการ</p>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  { day: "จันทร์ – ศุกร์", hours: "08:00 – 18:00" },
                  { day: "เสาร์", hours: "09:00 – 16:00" },
                  { day: "อาทิตย์", hours: null },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-500">{day}</span>
                    {hours ? (
                      <span className="font-semibold text-gray-700">
                        {hours}
                      </span>
                    ) : (
                      <span className="text-gray-300">หยุด</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-green-50 rounded-lg px-3 py-2 flex items-center gap-2">
                <CircleCheck size={14} className="text-green-600" />
                <span className="text-xs text-green-700">
                  เปิดให้บริการอยู่ในขณะนี้
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="border border-gray-200 rounded-xl bg-white p-5">
              <p className="text-sm font-bold text-[#4E0707] mb-3">ที่อยู่</p>
              <div className="flex gap-2.5">
                <MapPin
                  size={15}
                  className="text-[#B4915B] mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-500 leading-relaxed">
                  อาคารสมาร์ทวิชั่น ชั้น 12, 123 ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร 10110
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-gray-500">
        {label}
        {required && <span className="text-[#4E0707] ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
