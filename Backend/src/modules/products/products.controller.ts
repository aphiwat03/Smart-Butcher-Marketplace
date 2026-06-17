import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  GetProductsFilterDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() filterDto: GetProductsFilterDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get('categories')
  findCategories() {
    return this.productsService.findCategories();
  }

  @Get('max-price')
  findMaxPrice() {
    return this.productsService.findMaxPrice();
  }

  @Get('my-store')
  @UseGuards(JwtAuthGuard)
  async findMyStoreProducts(@Req() req: any) {
    const userId = req.user.userId;
    return this.productsService.findMyStoreProducts(userId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.productsService.create(createProductDto, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
