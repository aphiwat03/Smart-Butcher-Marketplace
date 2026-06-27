import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma-db/prisma.module';
import { AdminController } from './admin.controller';
import { AdminGuard } from './guards/admin.guard';
import { SellerOrAdminGuard } from './guards/seller-or-admin.guard';
import { OrderService } from './order.service';
import { StoreController } from './store.controller';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, AdminController, StoreController],
  providers: [OrderService, AdminGuard, SellerOrAdminGuard],
})
export class OrderModule {}
