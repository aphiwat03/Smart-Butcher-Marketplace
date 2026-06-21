import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products/my-store')
  async findMyStoreProducts(@Req() req: any, @Query('page') page?: string) {
    const userId = req.user.userId;
    const pageNumber = parseInt(page || '1', 10);
    return this.productsService.findMyStoreProducts(userId, pageNumber, 8);
  }

  @Post('products')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.productsService.create(createProductDto, userId);
  }
}
