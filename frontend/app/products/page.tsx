"use client";
import ProductCard from "@/components/product/product-card";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/*HEADER*/}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">สินค้าทั้งหมด</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ค้นหาเนื้อสัตว์พรีเมียมจากร้านค้าชั้นนำ
        </p>
      </div>

      {/*TOOLBAR*/}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="w-full sm:w-52">
          <select className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-base outline-none">
            <option>ใหม่สุด</option>
            <option>ราคาต่ำ → สูง</option>
            <option>ราคาสูง → ต่ำ</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-xl border p-4">
          <h3 className="mb-6 text-2xl font-semibold text-foreground">
            ตัวกรอง
          </h3>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-base font-medium text-foreground">
                หมวดหมู่
              </label>
              <select className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base outline-none">
                <option>ทั้งหมด</option>
              </select>
              <div>
                <label className="mb-2 block text-base font-medium text-foreground">
                  ร้านค้า
                </label>
                <select className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base outline-none">
                  <option>ทั้งหมด</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-base font-medium text-foreground">
                ช่วงราคา: ฿0 - ฿5,000
              </label>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-2/3 rounded-full bg-orange-500" />
              </div>
            </div>
            <button className="h-12 w-full rounded-xl border border-border bg-white text-base font-medium text-foreground transition hover:border-muted">
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <section>
          <div className="mb-4 text-sm text-muted-foreground">พบ 3 รายการ</div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ProductCard
              imageUrl="https://experiencelife.lifetime.life/wp-content/uploads/2020/07/etbd20314723-card-meat-matters-1024x577.jpg"
              storeName="ร้านค้าชั้นนำ"
              name="เนื้อสัตว์พรีเมียม"
              price={100}
            />
            <ProductCard
              imageUrl="https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2020/03/steak-1200x675.jpg"
              storeName="ร้านค้าชั้นนำ"
              name="เนื้อสัตว์พรีเมียม"
              price={100}
            />
            <ProductCard
              imageUrl="https://cdn.shopify.com/s/files/1/0267/8118/8171/files/rawchixx.jpg?v=1729032482"
              storeName="ร้านค้าชั้นนำ"
              name="เนื้อสัตว์พรีเมียม"
              price={100}
            />
            <ProductCard
              imageUrl="https://www.goodmeat.com.au/globalassets/good-meat-v2/green-facts/images/nutrition-protein-mh.jpg"
              storeName="ร้านค้าชั้นนำ"
              name="เนื้อสัตว์พรีเมียม"
              price={100}
            />
            <ProductCard
              imageUrl="https://news.northwestern.edu/assets/Stories/2020/02/meat__FitMaxWzk3MCw2NTBd.jpg"
              storeName="ร้านค้าชั้นนำ"
              name="เนื้อสัตว์พรีเมียม"
              price={100}
            />
            <ProductCard
              imageUrl="https://i.ytimg.com/vi/E7clpOR-dY4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDlOyCAP5Cx3o8Ph6tlWdkFIRhEtQ"
              storeName="ร้านค้าชั้นนำ"
              name="เนื้อสัตว์พรีเมียม"
              price={100}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
