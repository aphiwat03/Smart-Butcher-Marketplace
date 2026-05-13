"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, Circle } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify/unstyled";
//function show checklist password requirement
function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 ${met ? "text-emerald-600" : "text-gray-400"}`}
    >
      {met ? (
        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100">
          <Check size={10} className="stroke-[4px]" />
        </div>
      ) : (
        <div className="flex h-3.5 w-3.5 items-center justify-center">
          <Circle size={8} className="stroke-[2px] opacity-40" />
        </div>
      )}
      <span className={`text-[11px] ${met ? "font-medium" : "font-normal"}`}>
        {label}
      </span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Check password requirements
  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    isEnglish: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/.test(password),
  };
  // Check if all requirements are met
  const isAllValid =
    Object.values(checks).every(Boolean) &&
    name.trim() !== "" &&
    password === confirmPassword &&
    isEmailValid &&
    name.trim() !== "";
  password === confirmPassword;
  const isPasswordMatching = () => password === confirmPassword;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordMatching) {
      alert("Password don't match!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Congratulations, your account has been successfully created.",
          icon: "success",
          confirmButtonColor: "#4E0707",
          confirmButtonText: "Login",
          backdrop: `
      rgba(0,0,0,0.4)
      left top
      no-repeat
    `,
          customClass: {
            container: "backdrop-blur-sm",
          },
          willClose: () => {
            router.push("/login");
          },
        });
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Registration Failed",
          text: errorData.message || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#4E0707",
          backdrop: `rgba(0,0,0,0.4)`,
          customClass: {
            container: "backdrop-blur-sm",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Connection Error",
        text: "Please check your internet connection and make sure the backend server is running.",
        icon: "warning",
        confirmButtonColor: "#4E0707",
        backdrop: `rgba(0,0,0,0.4)`,
        customClass: {
          container: "backdrop-blur-sm",
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">สมัครสมาชิก</h2>
        <p className="mt-2 text-sm text-gray-600">
          เริ่มต้นการใช้งานด้วยการสร้างบัญชีผู้ใช้ใหม่ของคุณวันนี้!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              const filteredValue = e.target.value.replace(
                /[^a-zA-Z0-9@._+-]/g,
                "",
              );
              setEmail(filteredValue);
            }}
            placeholder="example@mail.com"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/g,
                  "",
                );
                setPassword(value);
              }}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/g,
                  "",
                );
                setConfirmPassword(value);
              }}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 px-1">
            <RequirementItem label="อย่างน้อย 8 ตัวอักษร" met={checks.length} />
            <RequirementItem label="ตัวเลข (0-9)" met={checks.hasNumber} />
            <RequirementItem
              label="พิมพ์ใหญ่และพิมพ์เล็ก"
              met={checks.hasUpper && checks.hasLower}
            />
            <RequirementItem
              label="อักขระพิเศษ (@, #, $...)"
              met={checks.hasSpecial}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#4E0707] hover:bg-[#4E0707]/90 shadow-lg shadow-red-200 py-6"
          disabled={!isAllValid || !isEmailValid}
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#4E0707] hover:text-[#4E0707]"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
