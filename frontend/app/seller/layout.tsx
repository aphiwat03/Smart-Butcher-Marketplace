"use client";

import { ReactNode } from "react";
import SellerSidebar from "@/components/layout/seller-sidebar";
import SellerHeader from "@/components/layout/seller-header";

interface SellerLayoutProps {
  children: ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <SellerHeader />

        {/* Content Area */}
        <div className="flex-1">
          <div className="p-4 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
