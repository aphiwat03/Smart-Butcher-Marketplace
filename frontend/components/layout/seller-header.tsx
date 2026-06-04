export default function SellerHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 shadow-sm lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="truncate text-xl font-bold text-[#4E0707] lg:text-2xl">
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
