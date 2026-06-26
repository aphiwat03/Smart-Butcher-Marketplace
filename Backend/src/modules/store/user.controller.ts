import { Body, Controller, Post, Req, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './store.service';

@Controller('users')
export class UserController {
  constructor(private readonly storeService: StoreService) {}

  @Post('stores')
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() createStoreDto: CreateStoreDto) {
    const userId = req.user.userId;
    return this.storeService.create(userId, createStoreDto);
  }

  @Get('stores/:id')
  async getStorePublicInfo(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.getStorePublicInfo(id);
  }
}
