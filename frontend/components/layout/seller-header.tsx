export default function SellerHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#4E0707]">
          Smart Butcher - Seller Platform
        </h2>
        <div className="flex items-center gap-4">
          <img
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=seller"
            alt="seller"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
