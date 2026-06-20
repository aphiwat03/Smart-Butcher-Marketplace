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
    name: 'เนื้อสำหรับสเต็ก',
    image: '/mock/category/พรีเมียมสเต็ก.jpg',
    products: [
      {
        name: 'สันในสเต็ก',
        description: 'เนื้อสันในนุ่มพิเศษ เหมาะสำหรับย่างสเต็กแบบมีเดียมแรร์',
        price: 1290,
      },
      {
        name: 'สันนอกสเต็ก',
        description: 'สันนอกเนื้อแน่น ไขมันกำลังดี เหมาะสำหรับสเต็กประจำบ้าน',
        price: 990,
      },
      {
        name: 'ริบอายสเต็ก',
        description: 'ริบอายลายไขมันสวย ให้รสเข้มและความฉ่ำหลังย่าง',
        price: 1190,
      },
      {
        name: 'ทีโบนสเต็ก',
        description: 'ทีโบนชิ้นใหญ่ ได้ทั้งสันในและสันนอกในชิ้นเดียว',
        price: 1450,
      },
      {
        name: 'ใบพายสเต็ก',
        description: 'ใบพายเนื้อนุ่ม มีเอ็นกลางบาง ๆ เหมาะกับการย่างไฟแรง',
        price: 690,
      },
      {
        name: 'พิคานย่าสเต็ก',
        description: 'พิคานย่าพร้อมมันด้านบน หอมมันเมื่อย่างจนผิวกรอบ',
        price: 890,
      },
    ],
  },
  {
    name: 'เนื้อสไลซ์ชาบู / ปิ้งย่าง',
    image: '/mock/category/เนื้อชาบู.jpg',
    products: [
      {
        name: 'ริบอายสไลซ์',
        description: 'ริบอายสไลซ์บาง ลวกชาบูหรือย่างบนกระทะได้หอมนุ่ม',
        price: 520,
      },
      {
        name: 'ใบพายสไลซ์',
        description: 'ใบพายสไลซ์เนื้อนุ่ม เหมาะสำหรับชาบูและสุกี้',
        price: 390,
      },
      {
        name: 'เสือร้องไห้ปิ้งย่าง',
        description: 'เสือร้องไห้มันแทรก หอมฉ่ำเมื่อย่างไฟกลาง',
        price: 450,
      },
      {
        name: 'น่องลายสไลซ์',
        description: 'น่องลายสไลซ์กรุบเบา ๆ เหมาะกับชาบูน้ำซุปเข้มข้น',
        price: 420,
      },
      {
        name: 'สามชั้นเนื้อสไลซ์',
        description: 'เนื้อสามชั้นสไลซ์มันสวย เหมาะกับปิ้งย่างและหม้อไฟ',
        price: 480,
      },
      {
        name: 'วากิวสไลซ์ชาบู',
        description: 'วากิวสไลซ์ลายไขมันละเอียด ลวกเร็วแล้วละลายในปาก',
        price: 890,
      },
    ],
  },
  {
    name: 'เนื้อบด',
    image: '/mock/category/เนื้อบด.jpg',
    products: [
      {
        name: 'เนื้อบดติดมัน',
        description: 'เนื้อบดติดมันประมาณ 20% เหมาะสำหรับเบอร์เกอร์และผัดซอส',
        price: 260,
      },
      {
        name: 'เนื้อบดไม่ติดมัน',
        description: 'เนื้อบดไขมันต่ำ เหมาะสำหรับเมนูคลีนหรือซอสพาสต้า',
        price: 290,
      },
      {
        name: 'เนื้อบดสำหรับเบอร์เกอร์',
        description: 'เนื้อบดสูตรเบอร์เกอร์ ปั้นง่าย ย่างแล้วฉ่ำ',
        price: 340,
      },
      {
        name: 'เนื้อบดหยาบ',
        description: 'เนื้อบดหยาบให้สัมผัสชัด เหมาะสำหรับมีทบอลและลาซานญ่า',
        price: 320,
      },
      {
        name: 'เนื้อบดวากิว',
        description: 'เนื้อบดวากิวมันหอม เหมาะสำหรับแพตตี้พรีเมียม',
        price: 590,
      },
      {
        name: 'เนื้อบดหมักพริกไทยดำ',
        description: 'เนื้อบดปรุงรสพริกไทยดำ พร้อมนำไปทำแพตตี้หรือผัด',
        price: 360,
      },
    ],
  },
  {
    name: 'เนื้อแปรรูป',
    image: '/mock/category/เนื้อคัดพิเศษ.jpg',
    products: [
      {
        name: 'เบอร์เกอร์แพตตี้เนื้อ',
        description: 'แพตตี้เนื้อปั้นสำเร็จ พร้อมย่างสำหรับเบอร์เกอร์',
        price: 390,
      },
      {
        name: 'ไส้กรอกเนื้อรมควัน',
        description: 'ไส้กรอกเนื้อรมควัน กลิ่นหอม หนังกรอบเด้ง',
        price: 320,
      },
      {
        name: 'เนื้อหมักซอสบาร์บีคิว',
        description: 'เนื้อหมักซอสบาร์บีคิว พร้อมย่างหรืออบ',
        price: 450,
      },
      {
        name: 'เนื้อแดดเดียว',
        description: 'เนื้อแดดเดียวหมักรสกลมกล่อม เหมาะสำหรับทอดหรือย่าง',
        price: 380,
      },
      {
        name: 'ลูกชิ้นเนื้อพรีเมียม',
        description: 'ลูกชิ้นเนื้อเด้ง รสเนื้อชัด เหมาะกับก๋วยเตี๋ยวและปิ้ง',
        price: 220,
      },
      {
        name: 'เนื้อหมักพริกไทยดำ',
        description: 'เนื้อหมักพริกไทยดำเข้มข้น พร้อมนำไปผัดหรือย่าง',
        price: 430,
      },
    ],
  },
  {
    name: 'เนื้อดรายเอจ',
    image: '/mock/category/ดรายเอจ.jpg',
    products: [
      {
        name: 'ดรายเอจริบอาย 30 วัน',
        description: 'ริบอายดรายเอจ 30 วัน กลิ่นนัทตี้และรสเข้มขึ้น',
        price: 1850,
      },
      {
        name: 'ดรายเอจสันนอก 30 วัน',
        description: 'สันนอกดรายเอจ เนื้อแน่น รสชัด เหมาะกับสเต็ก',
        price: 1650,
      },
      {
        name: 'ดรายเอจทีโบน 45 วัน',
        description: 'ทีโบนดรายเอจ 45 วัน ชิ้นใหญ่สำหรับสายสเต็กจริงจัง',
        price: 2400,
      },
      {
        name: 'ดรายเอจพิคานย่า',
        description: 'พิคานย่าดรายเอจพร้อมชั้นมัน หอมมากเมื่อย่าง',
        price: 1550,
      },
      {
        name: 'ดรายเอจโทมาฮอว์ก',
        description: 'โทมาฮอว์กดรายเอจชิ้นใหญ่ เหมาะสำหรับแชร์หลายคน',
        price: 3200,
      },
      {
        name: 'ดรายเอจเซ็ตทดลอง',
        description: 'เซ็ตชิ้นเล็กสำหรับลองรสชาติเนื้อดรายเอจหลายส่วน',
        price: 1290,
      },
    ],
  },
  {
    name: 'เนื้อวากิวคัดพิเศษ',
    image: '/mock/category/วากิวคัดพิเศษ.webp',
    products: [
      {
        name: 'วากิวริบอาย',
        description: 'วากิวริบอายลายหินอ่อนเด่น รสเข้มและนุ่มละลาย',
        price: 2590,
      },
      {
        name: 'วากิวสันนอก',
        description: 'วากิวสันนอกเนื้อแน่น ไขมันแทรกละเอียด เหมาะกับสเต็ก',
        price: 2290,
      },
      {
        name: 'วากิวสันใน',
        description: 'วากิวสันในนุ่มมาก เหมาะสำหรับเมนูพิเศษ',
        price: 2890,
      },
      {
        name: 'วากิวสไลซ์ยากินิกุ',
        description: 'วากิวสไลซ์สำหรับยากินิกุ ย่างเร็ว หอมมัน',
        price: 1490,
      },
      {
        name: 'วากิวคารูบิ',
        description: 'คารูบิวากิวมันแทรกชัด เหมาะกับปิ้งย่างสไตล์ญี่ปุ่น',
        price: 1690,
      },
      {
        name: 'วากิวเซ็ตพรีเมียม',
        description: 'เซ็ตวากิวรวมหลายส่วนสำหรับมื้อพิเศษ',
        price: 3490,
      },
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
      data: categoryMock.products.map((product) => ({
        storeId: store.id,
        categoryId: category.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: 50,
        imageUrl: categoryMock.image,
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
