import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา - ติดต่อสอบถามและสั่งซื้อเนื้อพรีเมียม",
  description:
    "ติดต่อทีมงาน Smart Butcher Marketplace สอบถามข้อมูลเนื้อสัตว์ การสั่งซื้อ การจัดส่ง หรือสมัครเป็นผู้ขายเนื้อพรีเมียม",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
