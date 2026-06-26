import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from './guards/admin.guard';
import { PaymentService } from './payment.service';
import { PrismaModule } from '../../prisma-db/prisma.module';
import { UserController } from './user.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [UserController, AdminController],
  providers: [PaymentService, AdminGuard, SupabaseService],
  imports: [PrismaModule],
})
export class PaymentModule {}
