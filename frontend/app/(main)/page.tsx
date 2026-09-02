import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Smart Butcher Marketplace - แหล่งรวมเนื้อพรีเมียม สด สะอาด อันดับ 1",
  description:
    "ตลาดเนื้อสัตว์ออนไลน์อันดับ 1 ในไทย คัดสรรเนื้อวัวพรีเมียม วากิว ดรายเอจ และเนื้อคุณภาพสูงจากผู้ผลิตและร้านค้าชั้นนำโดยตรง สด สะอาด จัดส่งรวดเร็ว",
  alternates: {
    canonical: siteUrl,
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Smart Butcher Marketplace",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <HomeClient />
    </>
  );
}
