"use client";

import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes("login");

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-7xl h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* left */}
        <div className={`relative hidden lg:flex lg:w-1/2 p-10 lg:p-20`}>
          <img
            src={isLoginPage ? "/picture/login.png" : "/picture/login.png"}
            alt="Auth Background"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[#4E0707]/10 z-10" />
        </div>

        {/* right */}
        <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
