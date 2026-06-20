import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma-db/prisma.module';
import { AdminController } from './admin.controller';
import { ProductsService } from './products.service';
import { StoreController } from './store.controller';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, StoreController, AdminController],
  providers: [ProductsService],
})
export class ProductsModule {}
