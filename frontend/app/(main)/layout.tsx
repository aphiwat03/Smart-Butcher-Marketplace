import type { Metadata } from "next";
import "../globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "react-toastify/dist/ReactToastify.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Smart Butcher Marketplace",
  description: "ร้านขายเนื้ออันดับ1 ในไทย",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning={true}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Sarabun:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ margin: 0, padding: 0 }}
        className="flex flex-col min-h-screen"
      >
        <SiteHeader />

        <div className="flex-1 flex flex-col">{children}</div>

        <Toaster position="top-center" richColors />
        <SiteFooter />
      </body>
    </html>
  );
}
