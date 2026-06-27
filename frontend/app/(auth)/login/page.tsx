"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);

        const userRole = data.user.role;

        let targetPath = "/";

        if (userRole === "BUYER") {
          targetPath = "/";
        } else if (userRole === "SELLER") {
          targetPath = "/seller";
        } else if (userRole === "ADMIN") {
          targetPath = "/admin";
        }

        Swal.fire({
          title: "Login Success!",
          text: "ยินดีต้อนรับเข้าสู่ระบบ Smart Butcher",
          icon: "success",
          confirmButtonColor: "#4E0707",
          confirmButtonText: "OK",
          customClass: { container: "backdrop-blur-sm" },
        }).then(() => {
          router.push(targetPath);
        });
      } else {
        Swal.fire({
          title: "Login Failed",
          text: data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          icon: "error",
          confirmButtonColor: "#4E0707",
          customClass: { container: "backdrop-blur-sm" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Connection Error",
        text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
        icon: "warning",
        confirmButtonColor: "#4E0707",
        customClass: { container: "backdrop-blur-sm" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h2>
        <p className="mt-2 text-sm text-gray-600">
          กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ Smart Butcher
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            อีเมล
          </label>
          <div className="relative mt-1">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              size={18}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, ""))
              }
              placeholder="example@mail.com"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            รหัสผ่าน
          </label>
          <div className="relative mt-1">
            <LockKeyhole
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value.replace(
                    /[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/g,
                    "",
                  ),
                )
              }
              placeholder="Enter your password"
              className="pl-10 pr-12 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#4E0707] hover:bg-[#4E0707]/90 shadow-lg shadow-red-200 py-6"
        >
          {isLoading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/register"
          className="font-medium text-[#4E0707] hover:underline"
        >
          สมัครสมาชิกใหม่
        </Link>
      </p>
    </div>
  );
}
