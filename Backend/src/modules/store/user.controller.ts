import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './store.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly storeService: StoreService) {}

  @Post('stores')
  create(@Req() req: any, @Body() createStoreDto: CreateStoreDto) {
    const userId = req.user.userId;
    return this.storeService.create(userId, createStoreDto);
  }
}
