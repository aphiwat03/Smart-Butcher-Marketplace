"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
type CheckoutStep = "details" | "shipping" | "payment" | "upload" | "success";

interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    store?: {
      name: string;
    };
    category?: {
      name: string;
    };
  };
}

interface UserAddressData {
  id: number;
  title: string | null;
  receiverName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
}

const EMPTY_FORM: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  phoneNumber: "",
};

export default function CheckoutFlowPage() {
  const [step, setStep] = useState<CheckoutStep>("details");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saved, setSaved] = useState<FormData | null>(null);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddressData[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [userProfile, setUserProfile] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const fetchCartCount = useCartStore((e) => e.fetchCartCount);

  useEffect(() => {
    const fetchInitialCheckoutData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const cartResponse = await fetch("http://localhost:3001/cart", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCartItems(cartData);
        }

        let userEmail = "";
        const profileResponse = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          userEmail = profileData.email || "";

          const nameParts = profileData.fullName
            ? profileData.fullName.trim().split(/\s+/)
            : ["", ""];
          const fName = nameParts[0] || "";
          const lName = nameParts.slice(1).join(" ") || "";

          setUserProfile({
            email: userEmail,
            firstName: fName,
            lastName: lName,
          });
          setForm((prev) => ({
            ...prev,
            email: userEmail,
            firstName: fName,
            lastName: lName,
          }));
        }

        const addressResponse = await fetch(
          "http://localhost:3001/users/address",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (addressResponse.ok) {
          const fetchedAddresses = await addressResponse.json();
          setAddresses(fetchedAddresses);

          if (fetchedAddresses && fetchedAddresses.length > 0) {
            const defaultAddress = fetchedAddresses[0];
            setSelectedAddressId(defaultAddress.id);

            const nameParts = defaultAddress.receiverName.split(" ");
            const mappedAddress = {
              email: userEmail,
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              address: defaultAddress.addressLine,
              city: defaultAddress.city,
              postalCode: defaultAddress.postalCode,
              phoneNumber: defaultAddress.phoneNumber,
            };

            setForm(mappedAddress);
            setSaved(mappedAddress);
            setStep("shipping");
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial checkout data:", error);
      } finally {
        setIsCartLoading(false);
      }
    };

    fetchInitialCheckoutData();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  const handleSelectAddress = (addr: UserAddressData) => {
    setSelectedAddressId(addr.id);
    const nameParts = addr.receiverName.split(" ");

    setSaved({
      email: form.email,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      address: addr.addressLine,
      city: addr.city,
      postalCode: addr.postalCode,
      phoneNumber: addr.phoneNumber,
    });
  };

  const handleEditAddress = (addr: UserAddressData) => {
    setEditingAddressId(addr.id);

    const nameParts = addr.receiverName ? addr.receiverName.split(" ") : [];
    const fName = nameParts[0] || userProfile?.firstName || "";
    const lName = nameParts.slice(1).join(" ") || userProfile?.lastName || "";

    setForm({
      email: userProfile?.email || form.email,
      firstName: fName,
      lastName: lName,
      address: addr.addressLine,
      city: addr.city,
      postalCode: addr.postalCode,
      phoneNumber: addr.phoneNumber,
    });
    setStep("details");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "phoneNumber":
        formattedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
        break;

      case "postalCode":
        formattedValue = value.replace(/[^0-9]/g, "").slice(0, 5);
        break;

      case "firstName":
      case "lastName":
      case "city":
        // ห้ามตัวเลขอารบิก/ไทย และห้ามอักขระพิเศษพวกรหัสสัญลักษณ์ อนุญาตเฉพาะตัวอักษรและช่องว่าง
        formattedValue = value.replace(
          /[0-9๐-๙!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g,
          "",
        );
        break;

      default:
        formattedValue = value;
    }

    // ล้างข้อความแจ้งเตือน Error ของฟิลด์นั้นๆ ทันทีเมื่อผู้ใช้เริ่มแก้ไขข้อมูลใหม่
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      newErrors.email = "กรุณากรอกรูปแบบอีเมลให้ถูกต้อง";
    }
    if (!form.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!form.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!form.address.trim())
      newErrors.address = "กรุณากรอกที่อยู่สำหรับจัดส่ง";
    if (!form.city.trim()) newErrors.city = "กรุณากรอกจังหวัด";
    if (form.phoneNumber.length < 9 || form.phoneNumber.length > 10) {
      newErrors.phoneNumber = "เบอร์โทรศัพท์ต้องเป็นตัวเลขความยาว 9-10 หลัก";
    }
    if (form.postalCode.length !== 5) {
      newErrors.postalCode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const isUnchanged =
      saved &&
      saved.firstName === form.firstName &&
      saved.lastName === form.lastName &&
      saved.phoneNumber === form.phoneNumber &&
      saved.address === form.address &&
      saved.city === form.city &&
      saved.postalCode === form.postalCode;

    if (isUnchanged) {
      setStep("shipping");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const addressPayload = {
        receiverName: `${form.firstName} ${form.lastName}`,
        phoneNumber: form.phoneNumber,
        addressLine: form.address,
        city: form.city,
        postalCode: form.postalCode,
      };

      const method = editingAddressId ? "PATCH" : "POST";
      const url = editingAddressId
        ? `http://localhost:3001/users/address/${editingAddressId}`
        : "http://localhost:3001/users/address";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressPayload),
      });

      if (!res.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกที่อยู่");
      }
      const fetchNewAddresses = await fetch(
        "http://localhost:3001/users/address",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (fetchNewAddresses.ok) {
        const newData = await fetchNewAddresses.json();
        setAddresses(newData);

        const activeId = editingAddressId || newData[0]?.id;
        if (activeId) setSelectedAddressId(activeId);
      }

      setEditingAddressId(null);
      setSaved({ ...form });
      setStep("shipping");
    } catch (error) {
      console.error(error);
      alert("ระบบขัดข้อง ไม่สามารถบันทึกที่อยู่ได้ในขณะนี้");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSlipImage(imageUrl);
      setSlipFile(file);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("คุณต้องการลบที่อยู่นี้ใช่หรือไม่?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:3001/users/address/${addressId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("ไม่สามารถลบที่อยู่ได้");

      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressId,
      );
      setAddresses(updatedAddresses);

      if (updatedAddresses.length === 0) {
        setStep("details");
        setSaved(null);
        setSelectedAddressId(null);
        setForm({ ...EMPTY_FORM, email: form.email });
      } else if (selectedAddressId === addressId) {
        handleSelectAddress(updatedAddresses[0]);
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการลบที่อยู่");
    }
  };

  const handleConfirmOrder = async () => {
    if (!saved || !slipFile) return;

    try {
      const token = localStorage.getItem("accessToken");

      const orderPayload = {
        shippingName: `${saved.firstName} ${saved.lastName}`,
        shippingPhone: saved.phoneNumber,
        shippingAddressText: `${saved.address} ${saved.city} ${saved.postalCode}`,
      };

      const orderResponse = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const errData = await orderResponse.json().catch(() => ({}));
        throw new Error(
          `สร้างออเดอร์ขัดข้อง: ${errData.message || "Unknown Error"}`,
        );
      }
      fetchCartCount();
      const orderData = await orderResponse.json();
      const orderId = orderData?.order?.id || orderData?.id;
      if (!orderId) {
        throw new Error(
          "สร้างออเดอร์สำเร็จ แต่ไม่สามารถอ่านค่า Order ID จาก Backend ได้",
        );
      }

      const formData = new FormData();
      formData.append("file", slipFile);
      formData.append("orderId", orderId.toString());
      formData.append("amount", totalAmount.toString());

      const paymentResponse = await fetch(
        "http://localhost:3001/payments/upload-slip",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!paymentResponse.ok) {
        const errData = await paymentResponse.json().catch(() => ({}));
        throw new Error(
          `อัปโหลดสลิปขัดข้อง: ${errData.message || "Unknown Error"}`,
        );
      }

      setStep("success");
    } catch (error: any) {
      console.error("Checkout Error Detail:", error);
      alert(error.message);
    }
  };

  const RightOrderSummary = () => (
    <aside className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-10 w-full">
      <h3 className="text-lg font-bold text-[#4E0707] border-b border-gray-100 pb-2 mb-6">
        สรุปรายการสั่งซื้อ (Order Summary)
      </h3>

      <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-1">
        {isCartLoading ? (
          <p className="text-sm text-gray-400 text-center py-6">
            กำลังโหลดข้อมูลสินค้า...
          </p>
        ) : cartItems.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            ไม่มีสินค้าในตะกร้า
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-[#f7f5f2] rounded-xl gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    จำนวน: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold text-[#4E0707] flex-shrink-0">
                ฿{(item.unitPrice * item.quantity).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100 space-y-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>ยอดรวม (Subtotal)</span>
          <span className="font-medium text-gray-800">
            ฿{subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>ค่าจัดส่ง (Shipping)</span>
          <span className="font-medium text-green-600">
            {shippingFee === 0 ? "ฟรี" : `฿${shippingFee}`}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
        <span className="text-base font-bold text-gray-800">ยอดชำระสุทธิ</span>
        <span className="text-2xl font-black text-[#4E0707]">
          ฿{totalAmount.toLocaleString()}
        </span>
      </div>
    </aside>
  );

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
                      <span className="text-lg">←</span> ย้อนกลับไปตะกร้า
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
                    ← ย้อนกลับไปตะกร้า
                  </Link>
                  <button
                    onClick={() => setStep("payment")}
                    className="bg-[#4E0707] hover:bg-[#3D0505] text-white font-bold py-3 px-6 rounded-xl text-sm"
                  >
                    ไปที่การชำระเงิน →
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
                  href="/"
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-xl text-sm transition-colors text-center"
                >
                  กลับไปหน้าแรก
                </Link>
              </div>
            )}
          </section>

          {/* RIGHT SECTION */}
          <RightOrderSummary />
        </div>
      </main>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="text-xs font-semibold text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full border rounded-xl px-4 py-3 text-sm transition-colors ${
          error
            ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:bg-white"
            : "border-gray-200 bg-[#fafaf8] focus:bg-white focus:border-[#4E0707]"
        } focus:outline-none`}
      />
      {error && (
        <span className="text-xs text-red-500 mt-0.5 pl-1">{error}</span>
      )}
    </div>
  );
}

function InfoBox({
  title,
  fields,
  onEdit,
}: {
  title: string;
  fields: any[];
  onEdit?: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-[#fafaf8]">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-bold text-gray-700">{title}</h4>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-semibold text-[#4E0707] underline"
          >
            แก้ไข
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {fields.map((f, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:gap-4 text-sm">
            <span className="text-gray-400 w-20 shrink-0">{f.label}</span>
            <span className="text-gray-800 font-medium truncate">
              {f.value || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QRCodeMock() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-80"
    >
      <rect width="100" height="100" fill="white" />
      <rect
        x="10"
        y="10"
        width="25"
        height="25"
        stroke="#2c2c2c"
        strokeWidth="3"
      />
      <rect x="15" y="15" width="15" height="15" fill="#2c2c2c" />
      <rect
        x="65"
        y="10"
        width="25"
        height="25"
        stroke="#2c2c2c"
        strokeWidth="3"
      />
      <rect x="70" y="15" width="15" height="15" fill="#2c2c2c" />
      <rect
        x="10"
        y="65"
        width="25"
        height="25"
        stroke="#2c2c2c"
        strokeWidth="3"
      />
      <rect x="15" y="70" width="15" height="15" fill="#2c2c2c" />
      <rect x="45" y="10" width="10" height="10" fill="#2c2c2c" />
      <rect x="45" y="30" width="20" height="10" fill="#2c2c2c" />
      <rect x="10" y="45" width="10" height="10" fill="#2c2c2c" />
      <rect x="30" y="45" width="35" height="10" fill="#2c2c2c" />
      <rect x="75" y="45" width="15" height="10" fill="#2c2c2c" />
      <rect x="45" y="65" width="10" height="25" fill="#2c2c2c" />
      <rect x="65" y="65" width="25" height="10" fill="#2c2c2c" />
      <rect x="65" y="80" width="10" height="10" fill="#2c2c2c" />
      <rect x="80" y="80" width="10" height="10" fill="#2c2c2c" />
    </svg>
  );
}
