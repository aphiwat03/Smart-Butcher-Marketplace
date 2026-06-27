import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { PrismaModule } from './prisma-db/prisma.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { StoreModule } from './modules/store/store.module';
import { ReviewModule } from './modules/review/review.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductsModule,
    PrismaModule,
    CartModule,
    OrderModule,
    UserModule,
    PaymentModule,
    StoreModule,
    ReviewModule,
    AiModule,
  ],
})
export class AppModule {}
