import Link from "next/link";
import { Mail, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h2>
        <p className="mt-2 text-sm text-gray-600">
          กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ Smart Butcher
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            อีเมล
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="email"
              placeholder="example@mail.com"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            รหัสผ่าน
          </label>
          <div className="relative mt-1">
            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="password"
              placeholder="Enter you password"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
            <FieldLabel
              htmlFor="terms-checkbox-basic"
              className="ml-2 text-gray-600"
            >
              จดจำฉันไว้
            </FieldLabel>
          </label>
          <a
            href="/forgot-password"
            className="font-medium text-[#4E0707] hover:text-[#4E0707]"
          >
            ลืมรหัสผ่าน?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#4E0707] hover:bg-[#4E0707]/90 shadow-lg shadow-red-200 py-6"
        >
          เข้าสู่ระบบ
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/register"
          className="font-medium text-[#4E0707] hover:text-[#4E0707]"
        >
          สมัครสมาชิกใหม่
        </Link>
      </p>
    </div>
  );
}
