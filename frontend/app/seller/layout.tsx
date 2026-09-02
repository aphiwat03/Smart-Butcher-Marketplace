"use client";

import { useState } from "react";
import SellerSidebar from "@/components/layout/seller-sidebar";
import SellerHeader from "@/components/layout/seller-header";
import { SellerLayoutProps } from "@/types/seller";

export default function SellerLayout({ children }: SellerLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <SellerHeader onMenuClick={() => setMobileOpen(true)} />

        {/* Content Area */}
        <div className="flex-1">
          <div className="p-4 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
