import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { PrismaModule } from './prisma-db/prisma.module';
import { CartModule } from './modules/cart/cart.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductsModule,
    PrismaModule,
    CartModule,
  ],
})
export class AppModule {}
