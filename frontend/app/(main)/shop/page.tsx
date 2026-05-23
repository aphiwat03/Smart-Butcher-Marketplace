"use client";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArchiveBoxIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function ShopPage() {
  // 1. State สำหรับราคา
  const [maxPrice, setMaxPrice] = useState(99999);

  // 2. State สำหรับหมวดหมู่ (เปลี่ยนจากตัวแปรธรรมดาเป็น State เพื่อให้ Reset ได้)
  const [categories, setCategories] = useState([
    { value: "beef", label: "เนื้อวัวพรีเมียม (Beef)", checked: false },
    { value: "pork", label: "เนื้อหมู (Pork)", checked: false },
    { value: "chicken", label: "เนื้อไก่ (Chicken)", checked: false },
    { value: "shabu", label: "เซ็ตชาบู/ปิ้งย่าง", checked: true },
  ]);

  // ฟังก์ชันสลับค่า Checkbox
  const handleCategoryChange = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].checked = !newCategories[index].checked;
    setCategories(newCategories);
  };

  // 3. ฟังก์ชันสำหรับล้างค่าทั้งหมด (Reset)
  const handleReset = () => {
    setMaxPrice(0); // คืนค่าราคากลับไปสูงสุด
    setCategories(categories.map((cat) => ({ ...cat, checked: false }))); // เอาเครื่องหมายถูกออกทั้งหมด
  };

  // 4. ฟังก์ชันสำหรับเตรียมส่งข้อมูลไป Backend (Submit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีโหลด

    // ดึงเฉพาะ value ของหมวดหมู่ที่ถูกติ๊กเลือก
    const selectedCategories = categories
      .filter((cat) => cat.checked)
      .map((cat) => cat.value);

    // แพ็กข้อมูลเตรียมส่ง API
    const filterPayload = {
      maxPrice: maxPrice,
      categories: selectedCategories,
    };

    console.log("เตรียมส่งข้อมูลให้ Backend:", filterPayload);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* คอลัมน์ซ้าย: ตัวกรอง (เปลี่ยนเป็นแท็ก <form>) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit"
        >
          <h3 className="text-lg font-bold text-[#4E0707] mb-4 border-b pb-2 border-gray-200">
            ค้นหารายละเอียดสินค้า
          </h3>

          <div className="space-y-6 text-sm text-gray-600">
            {/* ส่วนแบ่งตามราคา */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-[#4E0707]">แบ่งตามราคา</p>
                <p className="text-sm font-bold text-[#B4915B]">
                  สูงสุด ฿{maxPrice.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3 mt-2">
                <input
                  type="range"
                  min="0"
                  max="99999"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B4915B]"
                />
                {/* ตัวเลขกำกับหัวท้าย */}
                <div className="flex justify-between text-xs text-[#4E0707]">
                  <span>฿0</span>
                  <span>฿99,999</span>
                </div>
              </div>
            </div>

            {/* ส่วนแบ่งตามหมวดหมู่ */}
            <div className="border-t border-gray-200 pt-4">
              <p className="font-semibold mb-3 text-[#4E0707]">
                แบ่งตามหมวดหมู่
              </p>
              <div className="space-y-3">
                {categories.map((option, idx) => (
                  <div key={option.value} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`category-${idx}`}
                      checked={option.checked} // ใช้ checked คุมผ่าน State
                      onChange={() => handleCategoryChange(idx)} // อัปเดต State เมื่อคลิก
                      className="h-4 w-4 rounded border-gray-300 text-[#B4915B] focus:ring-[#B4915B] cursor-pointer"
                    />
                    <label
                      htmlFor={`category-${idx}`}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5">
              {/* ปุ่มล้างค่าทั้งหมด (เรียก handleReset) */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-xl border border-gray-300 transition-colors text-center"
              >
                ล้างค่า
              </button>

              {/* ปุ่มค้นหา (เปลี่ยนเป็น type="submit" เพื่อสั่งงานฟอร์ม) */}
              <button
                type="submit"
                className="w-full bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-2 px-4 rounded-xl transition-colors text-center shadow-sm"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </form>

        {/* คอลัมน์ขวา: รายการสินค้า */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-500 mb-6">
            สินค้าเกี่ยวข้องกับ
            <span className="text-2xl font-bold text-[#4E0707]"> xxx</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Item 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden"></div>
                <h4 className="font-bold text-[#4E0707]">Product 1</h4>
                <p className="text-[#B4915B] font-semibold mt-1">฿500</p>

                {/* ใช้ StarIcon แทน SVG และเปลี่ยนสีเป็น #4E0707 */}
                <span className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <StarIcon className="size-4 text-[#4E0707]" />
                  5.0 | ขายแล้ว 100+
                </span>
              </div>

              <span className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-xs text-[#4E0707]/80">
                <span className="flex items-center gap-1">
                  <ArchiveBoxIcon className="h-4 w-4 text-[#B4915B]" />
                  ส่ง น้อยกว่า 1 วัน
                </span>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-[#B4915B]" />
                  กรุงเทพฯ
                </span>
              </span>
            </div>

            {/* Item 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden"></div>
                <h4 className="font-bold text-[#4E0707]">Product 2</h4>
                <p className="text-[#B4915B] font-semibold mt-1">฿650</p>

                <span className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <StarIcon className="size-4 text-[#4E0707]" />
                  4.9 | ขายแล้ว 50+
                </span>
              </div>

              <span className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-xs text-[#4E0707]/80">
                <span className="flex items-center gap-1">
                  <ArchiveBoxIcon className="h-4 w-4 text-[#B4915B]" />
                  ส่ง น้อยกว่า 1 วัน
                </span>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-[#B4915B]" />
                  กรุงเทพฯ
                </span>
              </span>
            </div>

            {/* Item 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden"></div>
                <h4 className="font-bold text-[#4E0707]">Product 3</h4>
                <p className="text-[#B4915B] font-semibold mt-1">฿800</p>

                <span className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <StarIcon className="size-4 text-[#4E0707]" />
                  5.0 | ขายแล้ว 200+
                </span>
              </div>

              <span className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-xs text-[#4E0707]/80">
                <span className="flex items-center gap-1">
                  <ArchiveBoxIcon className="h-4 w-4 text-[#B4915B]" />
                  ส่ง น้อยกว่า 2 วัน
                </span>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-[#B4915B]" />
                  เชียงใหม่
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
