import 'dotenv/config';
import {
  PrismaClient,
  ProductStatus,
  StoreStatus,
  UserRole,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

const storeName = 'Smart Butcher Shop';

const categoriesMock = [
  {
    name: 'อุปกรณ์และเครื่องเคียง',
    image: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/01_grill_set.jpg',
    products: [
      { name: 'ชุดเตาย่าง 01', description: 'ชุดเตาย่างครบเซ็ต', price: 350, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/01_grill_set.jpg' },
      { name: 'ชุดเตาย่าง 02', description: 'ชุดเตาย่างขนาดกลาง', price: 450, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/02_grill_set.jpg' },
      { name: 'ชุดชาบู 03', description: 'ชุดชาบูพร้อมหม้อ', price: 500, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/03_shabu_set.jpg' },
      { name: 'น้ำจิ้มสุกี้สูตร 1', description: 'น้ำจิ้มสุกี้รสเด็ด', price: 65, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/04_suki_sauce.png' },
      { name: 'น้ำจิ้มสุกี้สูตร 2', description: 'น้ำจิ้มสุกี้รสจัดจ้าน', price: 65, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/05_suki_sauce.webp' },
      { name: 'น้ำจิ้มสุกี้สูตร 3', description: 'น้ำจิ้มสุกี้สูตรกวางตุ้ง', price: 65, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/06_suki_sauce.jpg' },
      { name: 'น้ำจิ้มปิ้งย่าง', description: 'น้ำจิ้มปิ้งย่างสไตล์เกาหลี', price: 75, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/07_grill_sauce.webp' },
      { name: 'ชุดเตาย่าง 08', description: 'ชุดเตาย่างชุดใหญ่', price: 550, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/bbq-shabu/08_grill_set.jpg' },
    ],
  },
  {
    name: 'เนื้อดรายเอจ',
    image: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/01_ribeye.jpg',
    products: [
      { name: 'ริบอาย (Ribeye)', description: 'เนื้อริบอายดรายเอจ', price: 1200, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/01_ribeye.jpg' },
      { name: 'สตริปลอยน์ (Striploin)', description: 'เนื้อสตริปลอยน์ดรายเอจ', price: 1100, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/02_striploin.webp' },
      { name: 'ทีโบน (T-Bone)', description: 'เนื้อทีโบนดรายเอจ', price: 1400, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/03_tbone.jpg' },
      { name: 'พอร์เตอร์เฮาส์ (Porterhouse)', description: 'เนื้อพอร์เตอร์เฮาส์ดรายเอจ', price: 1600, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/04_porterhouse.webp' },
      { name: 'โทมาฮอว์ก (Tomahawk)', description: 'เนื้อโทมาฮอว์กดรายเอจ', price: 2500, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/05_tomahawk.jpg' },
      { name: 'แฮงเกอร์ (Hanger)', description: 'เนื้อแฮงเกอร์ดรายเอจ', price: 850, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/06_hanger.jpg' },
      { name: 'พิคานย่า (Picanha)', description: 'เนื้อพิคานย่าดรายเอจ', price: 950, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/dry-aged/07_picanha.jpeg' },
    ],
  },
  {
    name: 'เนื้อบด',
    image: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/minced-meat/01_wagyu.webp',
    products: [
      { name: 'เนื้อวากิวบด', description: 'เนื้อวากิวบดคุณภาพเยี่ยม', price: 350, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/minced-meat/01_wagyu.webp' },
      { name: 'เนื้อแองกัสบด', description: 'เนื้อแองกัสบดสำหรับทำเบอร์เกอร์', price: 250, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/minced-meat/02_angus.webp' },
      { name: 'เนื้อออสเตรเลียบด', description: 'เนื้อออสเตรเลียบดสำหรับทำซอส', price: 200, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/minced-meat/03_australia_beef.jpg' },
      { name: 'เนื้อบดไขมันน้อย', description: 'เนื้อบดสูตรไขมันต่ำ', price: 220, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/minced-meat/04_low_fat_beef.webp' },
      { name: 'ลูกชิ้นเนื้อ', description: 'ลูกชิ้นเนื้อแท้ 100%', price: 150, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/minced-meat/05_meatball.jpg' },
    ],
  },
  {
    name: 'เนื้อวากิวคัดพิเศษ',
    image: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/01_ribeye_wagyu_a5.webp',
    products: [
      { name: 'ริบอายวากิว A5', description: 'เนื้อริบอายวากิว A5 ลายหินอ่อน', price: 2800, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/01_ribeye_wagyu_a5.webp' },
      { name: 'สตริปลอยน์วากิว A5', description: 'เนื้อสตริปลอยน์วากิว A5 สุดพรีเมียม', price: 2500, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/02_striploin_a5.webp' },
      { name: 'คารูบิ (ร่องซี่โครง)', description: 'เนื้อคารูบิสำหรับปิ้งย่าง', price: 850, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/03_karubi.jpg' },
      { name: 'สันคอ (Chuck)', description: 'เนื้อสันคอวากิว นุ่มละลาย', price: 750, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/04_chuck.png' },
      { name: 'พิคานย่า (Picanha)', description: 'เนื้อพิคานย่าวากิว', price: 950, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/05_picanha.webp' },
      { name: 'สันคอพิเศษ (Chuck Eye)', description: 'เนื้อสันคอพิเศษวากิวคัดเกรด', price: 850, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/06_chuck_eye.jpg' },
      { name: 'สะโพก (Rump)', description: 'เนื้อสะโพกวากิว รสเนื้อเข้มข้น', price: 650, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/wagyu/07_rump.png' },
    ],
  },
  {
    name: 'เนื้อสำหรับสเต็ก',
    image: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/steak/01_ribeye_steak.jpg',
    products: [
      { name: 'สเต็กริบอาย', description: 'เนื้อสเต็กริบอายชิ้นโต', price: 850, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/steak/01_ribeye_steak.jpg' },
      { name: 'สเต็กเทนเดอร์ลอยน์ (สันใน)', description: 'เนื้อสเต็กสันในนุ่มพิเศษ', price: 950, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/steak/02_tenderloin_steak.jpg' },
      { name: 'สเต็กทีโบน', description: 'เนื้อสเต็กทีโบนสุดคุ้ม', price: 1050, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/steak/03_tbone_steak.jpg' },
      { name: 'สเต็กโทมาฮอว์ก', description: 'เนื้อสเต็กโทมาฮอว์กอลังการ', price: 1800, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/steak/04_tomahawk_steak.jpg' },
      { name: 'สเต็กแฟลตไอออน', description: 'เนื้อสเต็กแฟลตไอออนนุ่มๆ', price: 750, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/steak/05_flat_iron_steak.jpg' },
      { name: 'สเต็กแฮงเกอร์', description: 'เนื้อสเต็กแฮงเกอร์รสเข้ม', price: 650, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/steak/06_hanger_steak.jpg' },
    ],
  },
  {
    name: 'เนื้อแปรรูป',
    image: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/processed-meat/01_german_sausage.jpg',
    products: [
      { name: 'ไส้กรอกเยอรมัน', description: 'ไส้กรอกเยอรมันแท้เนื้อแน่น', price: 180, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/processed-meat/01_german_sausage.jpg' },
      { name: 'เนื้อรมควันพริกไทยดำ', description: 'เนื้อรมควันคลุกพริกไทยดำ', price: 220, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/processed-meat/02_smoked_black_pepper.jpg' },
      { name: 'เบคอนรมควัน', description: 'เบคอนรมควันหอมๆ', price: 190, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/processed-meat/03_smoked_bacon.png' },
      { name: 'โบโลญญ่า', description: 'โบโลญญ่าเนื้อนุ่ม', price: 120, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/processed-meat/04_bologna.jpg' },
      { name: 'แฮมพริกไทย', description: 'แฮมพริกไทยหอมกรุ่น', price: 160, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/processed-meat/05_pepper_ham.jpg' },
      { name: 'ซาลามี่', description: 'ซาลามี่รสชาติต้นตำรับ', price: 250, imageUrl: 'https://gfvlzoewacvhlkdiyprp.supabase.co/storage/v1/object/public/products/shop-pic/processed-meat/06_salami.jpg' },
    ],
  },
];

async function main() {
  console.log('เริ่มรัน Seed...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@butcher.com' },
    update: {
      fullName: 'เจ้าของร้าน',
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email: 'admin@butcher.com',
      passwordHash,
      fullName: 'เจ้าของร้าน',
      role: UserRole.ADMIN,
    },
  });

  let store = await prisma.store.findFirst({
    where: {
      ownerUserId: user.id,
      name: storeName,
    },
  });

  store ??= await prisma.store.create({
    data: {
      ownerUserId: user.id,
      name: storeName,
      description: 'ร้านขายเนื้อทดสอบระบบ',
      status: StoreStatus.OPEN,
    },
  });

  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.promotion.deleteMany({});

  await prisma.product.deleteMany({
    where: {
      storeId: store.id,
    },
  });

  for (const categoryMock of categoriesMock) {
    const category = await prisma.category.upsert({
      where: { name: categoryMock.name },
      update: {
        description: `รายละเอียดหมวดหมู่ ${categoryMock.name}`,
      },
      create: {
        name: categoryMock.name,
        description: `รายละเอียดหมวดหมู่ ${categoryMock.name}`,
      },
    });

    await prisma.product.createMany({
      data: categoryMock.products.map((product: any) => ({
        storeId: store!.id,
        categoryId: category.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: 50,
        imageUrl: product.imageUrl || categoryMock.image,
        status: ProductStatus.ACTIVE,
      })),
    });

    console.log(
      `สร้างสินค้าหมวด "${categoryMock.name}" จำนวน ${categoryMock.products.length} ชิ้นสำเร็จ`,
    );
  }

  console.log('ข้อมูลลง Database เรียบร้อยทั้งหมด');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
