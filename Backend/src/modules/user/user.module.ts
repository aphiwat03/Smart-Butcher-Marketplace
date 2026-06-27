import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { PrismaModule } from '../../prisma-db/prisma.module';
import { AdminController } from './admin.controller';
import { AdminGuard } from '../guards/admin.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, AdminController],
  providers: [UsersService, AdminGuard],
})
export class UserModule {}
