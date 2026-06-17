import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() createStoreDto: CreateStoreDto) {
    const userId = req.user.userId;
    return this.storeService.create(userId, createStoreDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.storeService.findById(+id);
  }
}
