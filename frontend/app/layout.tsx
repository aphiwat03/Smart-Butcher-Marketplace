import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smart Butcher Marketplace - แหล่งรวมเนื้อพรีเมียม สด สะอาด อันดับ 1",
    template: "%s | Smart Butcher Marketplace",
  },
  description:
    "ตลาดเนื้อสัตว์ออนไลน์อันดับ 1 ในไทย คัดสรรเนื้อวัวพรีเมียม วากิว ดรายเอจ และเนื้อคุณภาพสูงจากผู้ผลิตและร้านค้าชั้นนำโดยตรง สด สะอาด จัดส่งรวดเร็ว",
  keywords: [
    "เนื้อวัว",
    "วากิว",
    "ดรายเอจ",
    "สเต็ก",
    "ซื้อเนื้อออนไลน์",
    "ร้านขายเนื้อ",
    "Smart Butcher",
    "Smart Butcher Marketplace",
    "เนื้อพรีเมียม",
  ],
  authors: [{ name: "Smart Butcher Marketplace" }],
  creator: "Smart Butcher Marketplace",
  publisher: "Smart Butcher Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: siteUrl,
    siteName: "Smart Butcher Marketplace",
    title: "Smart Butcher Marketplace - แหล่งรวมเนื้อพรีเมียม สด สะอาด อันดับ 1",
    description:
      "ตลาดเนื้อสัตว์ออนไลน์อันดับ 1 ในไทย คัดสรรเนื้อวัวพรีเมียม วากิว ดรายเอจ และเนื้อคุณภาพสูงจากผู้ผลิตโดยตรง",
    images: [
      {
        url: "/picture/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Smart Butcher Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Butcher Marketplace - แหล่งรวมเนื้อพรีเมียม สด สะอาด อันดับ 1",
    description:
      "ตลาดเนื้อสัตว์ออนไลน์อันดับ 1 ในไทย คัดสรรเนื้อวัวพรีเมียม วากิว ดรายเอจ และเนื้อคุณภาพสูง",
    images: ["/picture/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Smart Butcher Marketplace",
  url: siteUrl,
  logo: `${siteUrl}/picture/smart-butcher-icon.png`,
  description: "ตลาดเนื้อสัตว์ออนไลน์อันดับ 1 ในไทย คัดสรรเนื้อวัวพรีเมียม วากิว ดรายเอจ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={cn("font-sans", geist.variable)}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Sarabun:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors />
        <ToastContainer autoClose={3000} hideProgressBar={false} />
      </body>
    </html>
  );
}

