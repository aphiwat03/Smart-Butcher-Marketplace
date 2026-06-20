import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from './guards/admin.guard';
import { PaymentService } from './payment.service';
import { PrismaModule } from '../../prisma-db/prisma.module';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController, AdminController],
  providers: [PaymentService, AdminGuard],
  imports: [PrismaModule],
})
export class PaymentModule {}
