import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GetProductsFilterDto } from './dto';
import { ProductsService } from './products.service';

@Controller('users')
export class UserController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  findAll(@Query() filterDto: GetProductsFilterDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get('products/categories')
  findCategories() {
    return this.productsService.findCategories();
  }

  @Get('products/max-price')
  findMaxPrice() {
    return this.productsService.findMaxPrice();
  }

  @Get('products/:id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }
}
