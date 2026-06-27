"use client";

import { useState } from "react";
import { Save, Edit2, Plus, X } from "lucide-react";

export default function SellerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);

  const [profile, setProfile] = useState({
    storeName: "Smart Butcher Premium",
    ownerName: "สมชาย สุดหล่อ",
    email: "seller@smartbutcher.com",
    phone: "089-xxx-xxxx",
    description: "เราเป็นผู้จำหน่ายเนื้อสัตว์คุณภาพสูงที่คัดสรรอย่างดีที่สุด",
    address: "123 ถนนพหลโยธิน เขตจตุจักร กรุงเทพ 10900",
    province: "กรุงเทพมหานคร",
    postalCode: "10900",
    idCard: "1234567890123",
    taxId: "0105555123456",
    rating: "4.8",
    reviews: "156",
    followers: "1,243",
    totalSales: "฿1,234,567",
  });

  const [bankAccounts] = useState([
    {
      id: 1,
      bank: "ธนาคารกรุงเทพ",
      accountNumber: "xxx-xx-xxx89",
      accountName: "สมชาย สุดหล่อ",
      type: "savings",
    },
  ]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would call an API to save the profile
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#4E0707] mb-1">
          Seller Profile
        </h1>
        <p className="text-gray-600">
          Manage your seller information and settings
        </p>
      </div>

      {/* Store Info Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#4E0707] to-[#B4915B] h-24"></div>

        <div className="px-6 pb-6">
          {/* Store Avatar */}
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <img
              src="https://api.dicebear.com/9.x/adventurer/svg?seed=store"
              alt="store"
              className="w-24 h-24 rounded-lg border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.storeName}
                  onChange={(e) =>
                    handleProfileChange("storeName", e.target.value)
                  }
                  className="text-2xl font-bold w-full px-3 py-1 border border-gray-300 rounded-lg text-[#4E0707] focus:outline-none focus:border-[#B4915B]"
                />
              ) : (
                <h2 className="text-2xl font-bold text-[#4E0707]">
                  {profile.storeName}
                </h2>
              )}
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-[#B4915B] hover:bg-[#9A7A48] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>

          {/* Store Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Rating</p>
              <p className="text-2xl font-bold text-blue-600">
                ⭐ {profile.rating}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Reviews</p>
              <p className="text-2xl font-bold text-green-600">
                {profile.reviews}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Followers</p>
              <p className="text-2xl font-bold text-purple-600">
                {profile.followers}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#B4915B]/10 to-[#B4915B]/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-[#B4915B]">
                {profile.totalSales}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#4E0707]">
              Business Information
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={profile.ownerName}
                      onChange={(e) =>
                        handleProfileChange("ownerName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                      Province
                    </label>
                    <input
                      type="text"
                      value={profile.province}
                      onChange={(e) =>
                        handleProfileChange("province", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={profile.postalCode}
                      onChange={(e) =>
                        handleProfileChange("postalCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                      Tax ID
                    </label>
                    <input
                      type="text"
                      value={profile.taxId}
                      onChange={(e) =>
                        handleProfileChange("taxId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      handleProfileChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                    Store Description
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={(e) =>
                      handleProfileChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-[#B4915B] hover:bg-[#9A7A48] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Owner Name</p>
                  <p className="font-semibold text-[#4E0707]">
                    {profile.ownerName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-[#4E0707]">
                    {profile.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-[#4E0707]">
                    {profile.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">ID Card</p>
                  <p className="font-semibold text-[#4E0707]">
                    {profile.idCard}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Address</p>
                  <p className="font-semibold text-[#4E0707]">
                    {profile.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Tax ID</p>
                  <p className="font-semibold text-[#4E0707]">
                    {profile.taxId}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600 mb-1">Store Description</p>
                  <p className="font-semibold text-[#4E0707]">
                    {profile.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bank Accounts Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#4E0707]">Bank Accounts</h3>
          <button
            onClick={() => setShowBankForm(!showBankForm)}
            className="flex items-center gap-2 bg-[#B4915B] hover:bg-[#9A7A48] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>

        {showBankForm && (
          <div className="mb-6 p-4 border-2 border-[#B4915B] rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="ธนาคารกรุงเทพ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="xxx-xx-xxxxx-x"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4E0707] mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B4915B]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-[#B4915B] hover:bg-[#9A7A48] text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                Add Account
              </button>
              <button
                onClick={() => setShowBankForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#B4915B] transition-colors"
            >
              <div>
                <p className="font-semibold text-[#4E0707]">{account.bank}</p>
                <p className="text-sm text-gray-600">{account.accountNumber}</p>
                <p className="text-xs text-gray-500">{account.accountName}</p>
              </div>
              <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-[#4E0707] mb-4">
          Account Settings
        </h3>
        <div className="space-y-3">
          <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-[#B4915B] transition-colors cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="ml-3 font-semibold text-[#4E0707]">
              Receive order notifications
            </span>
          </label>
          <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-[#B4915B] transition-colors cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="ml-3 font-semibold text-[#4E0707]">
              Receive promotional updates
            </span>
          </label>
          <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-[#B4915B] transition-colors cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="ml-3 font-semibold text-[#4E0707]">
              Receive weekly sales report
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
