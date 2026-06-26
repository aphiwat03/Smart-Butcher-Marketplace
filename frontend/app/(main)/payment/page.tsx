"use client";

import Link from "next/link";
import { usePaymentCheckout } from "@/hooks/usePaymentCheckout";
import { EMPTY_FORM } from "@/lib/payment-constants";
import { FormField } from "@/components/payment/FormField";
import { InfoBox } from "@/components/payment/InfoBox";
import { QRCodeMock } from "@/components/payment/QRCodeMock";
import { OrderSummary } from "@/components/payment/OrderSummary";

export default function CheckoutFlowPage() {
  const {
    step,
    setStep,
    form,
    setForm,
    saved,
    slipImage,
    setSlipImage,
    cartItems,
    isCartLoading,
    addresses,
    selectedAddressId,
    setEditingAddressId,
    errors,
    userProfile,
    subtotal,
    shippingFee,
    totalAmount,
    handleSelectAddress,
    handleEditAddress,
    handleChange,
    handleSaveDetails,
    handleImageUpload,
    handleDeleteAddress,
    handleConfirmOrder,
  } = usePaymentCheckout();

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#2c2c2c] antialiased w-full">
      <main className="max-w-[1200px] mx-auto w-full px-6 py-10">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl font-black text-[#4E0707]">Checkout</h1>
          <p className="text-gray-500 mt-2">
            กรุณากรอกข้อมูลเพื่อทำการชำระเงิน
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT SECTION */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {/* STEP 1: Details */}
            {step === "details" && (
              <form
                onSubmit={handleSaveDetails}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-[#4E0707] border-b border-gray-100 pb-2">
                    ข้อมูลการติดต่อ
                  </h3>
                  <FormField
                    label="อีเมล (Email)"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={true}
                    error={errors.email}
                  />
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <h3 className="text-lg font-bold text-[#4E0707] border-b border-gray-100 pb-2">
                    ที่อยู่สำหรับจัดส่ง
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="ชื่อจริง"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      error={errors.firstName}
                    />
                    <FormField
                      label="นามสกุล"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      error={errors.lastName}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="ที่อยู่"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      error={errors.address}
                    />
                    <FormField
                      name="phoneNumber"
                      label="เบอร์โทรศัพท์"
                      type="tel"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      error={errors.phoneNumber}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="จังหวัด"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      error={errors.city}
                    />
                    <FormField
                      label="รหัสไปรษณีย์"
                      name="postalCode"
                      type="tel"
                      value={form.postalCode}
                      onChange={handleChange}
                      required
                      error={errors.postalCode}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between items-center">
                  {addresses.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const selectedAddr = addresses.find(
                          (a) => a.id === selectedAddressId,
                        );
                        if (selectedAddr) {
                          const nameParts = selectedAddr.receiverName
                            ? selectedAddr.receiverName.split(" ")
                            : [];
                          setForm({
                            email: userProfile?.email || form.email,
                            firstName:
                              nameParts[0] || userProfile?.firstName || "",
                            lastName:
                              nameParts.slice(1).join(" ") ||
                              userProfile?.lastName ||
                              "",
                            address: selectedAddr.addressLine,
                            city: selectedAddr.city,
                            postalCode: selectedAddr.postalCode,
                            phoneNumber: selectedAddr.phoneNumber,
                          });
                        } else {
                          setForm({
                            ...EMPTY_FORM,
                            email: userProfile?.email || form.email,
                            firstName: userProfile?.firstName || "",
                            lastName: userProfile?.lastName || "",
                          });
                        }
                        setStep("shipping");
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#4E0707] transition-colors"
                    >
                      <span className="text-lg">←</span> ยกเลิก
                    </button>
                  ) : (
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#4E0707] transition-colors"
                    >
                      <span className="text-lg">←</span> ไปที่ตะกร้า
                    </Link>
                  )}

                  <button
                    type="submit"
                    className="bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Shipping */}
            {step === "shipping" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-lg font-bold text-[#4E0707]">
                      เลือกที่อยู่สำหรับจัดส่ง
                    </h3>
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setForm({
                          ...EMPTY_FORM,
                          email: userProfile?.email || form.email,
                          firstName: userProfile?.firstName || "",
                          lastName: userProfile?.lastName || "",
                        });
                        setStep("details");
                      }}
                      className="text-sm font-bold text-[#4E0707] hover:underline"
                    >
                      + เพิ่มที่อยู่ใหม่
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-[#4E0707] bg-[#fafaf8]"
                            : "border-gray-200 hover:border-[#4E0707]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-4 flex-shrink-0 ${
                              selectedAddressId === addr.id
                                ? "border-[#4E0707] bg-white"
                                : "border-gray-300"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-800 truncate">
                                {addr.receiverName}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                                  ค่าเริ่มต้น
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              เบอร์โทร: {addr.phoneNumber}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {addr.addressLine}, {addr.city} {addr.postalCode}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(addr);
                            }}
                            className="text-xs font-semibold text-gray-400 hover:text-[#4E0707] underline whitespace-nowrap pl-2"
                          >
                            แก้ไข
                          </button>
                          <span className="text-gray-300 px-2">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr.id);
                            }}
                            className="text-xs font-semibold text-gray-400 hover:text-red-500 underline whitespace-nowrap"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <h3 className="text-lg font-bold text-[#4E0707] border-b border-gray-100 pb-2">
                    วิธีการจัดส่ง
                  </h3>
                  <label className="flex items-center gap-4 p-4 border-2 border-[#4E0707] rounded-xl bg-[#fafaf8] cursor-pointer">
                    <span className="w-4 h-4 rounded-full border-4 border-[#4E0707] bg-white block shrink-0" />
                    <div className="flex-1">
                      <span className="block font-bold text-sm text-gray-800">
                        Standard Shipping
                      </span>
                      <span className="block text-xs text-gray-500">
                        5–7 วันทำการ
                      </span>
                    </div>
                    <span className="font-bold text-sm text-[#4E0707]">
                      {shippingFee === 0 ? "ฟรี" : `฿${shippingFee}`}
                    </span>
                  </label>
                </div>
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                  <Link
                    href="/cart"
                    className="text-sm font-medium text-gray-500 hover:text-[#4E0707]"
                  >
                    ← ไปที่ตะกร้า
                  </Link>
                  <button
                    onClick={() => setStep("payment")}
                    className="bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3 px-6 rounded-xl text-sm"
                  >
                    ชำระเงิน →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === "payment" && (
              <div className="flex flex-col gap-6">
                <InfoBox
                  title="ข้อมูลของคุณ"
                  fields={[
                    {
                      label: "ชื่อ",
                      value: `${saved?.firstName} ${saved?.lastName}`,
                    },
                    {
                      label: "จัดส่ง",
                      value: `${saved?.address}, ${saved?.city}`,
                    },
                  ]}
                  onEdit={() => setStep("shipping")}
                />
                <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl bg-[#fafaf8] gap-4 mt-2">
                  <h3 className="text-lg font-bold text-[#4E0707]">
                    สแกนเพื่อชำระเงิน
                  </h3>
                  <div className="w-48 h-48 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
                    <QRCodeMock />
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    ยอดชำระทั้งหมด:{" "}
                    <strong className="text-lg text-[#4E0707]">
                      ฿{totalAmount.toLocaleString()}
                    </strong>
                    <br />
                    <span className="text-xs mt-1 block">
                      กรุณาบันทึกภาพหน้าจอ (สลิป) เมื่อชำระเงินสำเร็จ
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setStep("shipping")}
                    className="text-sm font-medium text-gray-500 hover:text-[#4E0707]"
                  >
                    ← กลับไปหน้าจัดส่ง
                  </button>
                  <button
                    onClick={() => setStep("upload")}
                    className="bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3 px-6 rounded-xl text-sm"
                  >
                    ชำระเงินแล้ว แนบสลิป →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Upload Slip */}
            {step === "upload" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-[#4E0707] border-b border-gray-100 pb-2">
                    แจ้งหลักฐานการโอนเงิน
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    อัปโหลดรูปภาพสลิปการโอนเงินเพื่อให้แอดมินตรวจสอบ ยอดรวมคือ{" "}
                    <strong className="text-[#4E0707]">
                      ฿{totalAmount.toLocaleString()}
                    </strong>
                  </p>

                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-[#fafaf8] cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative">
                    {slipImage ? (
                      <img
                        src={slipImage}
                        alt="Slip Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <span className="text-3xl mb-2">📸</span>
                        <p className="text-sm font-medium">
                          คลิกเพื่อเลือกไฟล์รูปภาพ
                        </p>
                        <p className="text-xs mt-1">รองรับ JPG, PNG</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {slipImage && (
                    <button
                      onClick={() => setSlipImage(null)}
                      className="text-xs text-red-500 hover:underline self-end"
                    >
                      ลบรูปภาพ
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setStep("payment")}
                    className="text-sm font-medium text-gray-500 hover:text-[#4E0707]"
                  >
                    ← กลับ
                  </button>
                  <button
                    disabled={!slipImage}
                    onClick={handleConfirmOrder}
                    className={`font-bold py-3 px-6 rounded-xl text-sm transition-colors ${
                      slipImage
                        ? "bg-[#4E0707] hover:bg-[#3D0505] text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    ยืนยันการสั่งซื้อ
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Success */}
            {step === "success" && (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl text-green-600">✓</span>
                </div>
                <h2 className="text-2xl font-black text-[#4E0707] mb-2">
                  ได้รับคำสั่งซื้อแล้ว!
                </h2>
                <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-sm">
                  ขอบคุณ <strong>{saved?.firstName}</strong>{" "}
                  คำสั่งซื้อและสลิปของคุณถูกส่งเข้าระบบแล้ว <br />
                  แอดมินจะทำการตรวจสอบและจัดส่งสินค้าในลำดับต่อไป
                </p>
                <Link
                  href="/orders"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-colors text-center shadow-sm"
                >
                  ยืนยัน
                </Link>
              </div>
            )}
          </section>

          {/* RIGHT SECTION */}
          <OrderSummary
            cartItems={cartItems}
            isCartLoading={isCartLoading}
            subtotal={subtotal}
            shippingFee={shippingFee}
            totalAmount={totalAmount}
          />
        </div>
      </main>
    </div>
  );
}
