import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SellerOrAdminGuard } from './guards/seller-or-admin.guard';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaModule } from '../../prisma-db/prisma.module';
import { UserController } from './user.controller';
import { AdminController } from './admin.controller';
import { AdminGuard } from '../guards/admin.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController, StoreController, AdminController],
  providers: [StoreService, SellerOrAdminGuard, AdminGuard],
})
export class StoreModule {}
