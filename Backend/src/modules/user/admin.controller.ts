import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { UsersService } from './user.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  findAllUsers() {
    return this.usersService.findAllForAdmin();
  }

  @Patch('users/:id/change-password')
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeUserPasswordDto,
  ) {
    return this.usersService.changePasswordForAdmin(id, dto.newPassword);
  }
}
