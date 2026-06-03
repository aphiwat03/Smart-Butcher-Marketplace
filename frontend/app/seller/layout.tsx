"use client";

import { ReactNode } from "react";
import SellerSidebar from "@/components/layout/seller-sidebar";
import SellerHeader from "@/components/layout/seller-header";

interface SellerLayoutProps {
  children: ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
