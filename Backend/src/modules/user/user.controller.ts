import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('address')
  createAddress(@Req() req: any, @Body() dto: CreateUserAddressDto) {
    const userId = req.user.userId;
    return this.usersService.createUserAddress(userId, dto);
  }

  @Get('address')
  getAddresses(@Req() req: any) {
    const userId = req.user.userId;
    return this.usersService.getUserAddresses(userId);
  }

  @Delete('address/:id')
  deleteAddress(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.usersService.deleteUserAddress(userId, Number(id));
  }

  @Patch('address/:id')
  updateAddress(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateUserAddressDto,
  ) {
    const userId = req.user.userId;
    return this.usersService.updateUserAddress(userId, Number(id), dto);
  }
}
