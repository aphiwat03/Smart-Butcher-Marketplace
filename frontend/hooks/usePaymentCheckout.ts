import { fetchApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import {
  CheckoutStep,
  CartItem,
  UserAddressData,
  CheckoutFormData,
} from "@/types/payment";
import { EMPTY_FORM } from "@/lib/payment-constants";

export function usePaymentCheckout() {
  const [step, setStep] = useState<CheckoutStep>("details");
  const [form, setForm] = useState<CheckoutFormData>(EMPTY_FORM);
  const [saved, setSaved] = useState<CheckoutFormData | null>(null);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddressData[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});
  const [userProfile, setUserProfile] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const fetchCartCount = useCartStore((e) => e.fetchCartCount);

  useEffect(() => {
    const fetchInitialCheckoutData = async () => {
      try {
        const cartResponse = await fetchApi(`/cart`, {
          method: "GET",
        });

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCartItems(cartData);
        }

        let userEmail = "";
        const profileResponse = await fetchApi(`/auth/me`, {
          method: "GET",
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

        const addressResponse = await fetchApi(`/users/address`, {
          method: "GET",
        });

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
        formattedValue = value.replace(
          /[0-9๐-๙!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g,
          "",
        );
        break;

      default:
        formattedValue = value;
    }

    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
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
      const addressPayload = {
        receiverName: `${form.firstName} ${form.lastName}`,
        phoneNumber: form.phoneNumber,
        addressLine: form.address,
        city: form.city,
        postalCode: form.postalCode,
      };

      const method = editingAddressId ? "PATCH" : "POST";
      const url = editingAddressId
        ? `${API_URL}/users/address/${editingAddressId}`
        : `${API_URL}/users/address`;

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressPayload),
      });

      if (!res.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกที่อยู่");
      }
      const fetchNewAddresses = await fetchApi(`/users/address`, {});

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
      const res = await fetchApi(`/users/address/${addressId}`, {
        method: "DELETE",
      });

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
      const formData = new FormData();
      formData.append("shippingName", `${saved.firstName} ${saved.lastName}`);
      formData.append("shippingPhone", saved.phoneNumber);
      formData.append(
        "shippingAddressText",
        `${saved.address} ${saved.city} ${saved.postalCode}`,
      );
      formData.append("amount", totalAmount.toString());
      formData.append("file", slipFile);

      const checkoutResponse = await fetchApi(`/users/checkout`, {
        method: "POST",

        body: formData,
      });

      if (!checkoutResponse.ok) {
        const errData = await checkoutResponse.json().catch(() => ({}));
        throw new Error(
          `การสั่งซื้อล้มเหลว: ${errData.message || "Unknown Error"}`,
        );
      }

      fetchCartCount();
      setStep("success");
    } catch (error: any) {
      console.error("Checkout Error Detail:", error);
      alert(error.message);
    }
  };

  return {
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
    editingAddressId,
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
  };
}
