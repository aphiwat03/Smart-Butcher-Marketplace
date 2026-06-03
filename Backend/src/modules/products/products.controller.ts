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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  GetProductsFilterDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto';

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

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
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
