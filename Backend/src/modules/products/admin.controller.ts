import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateProductDto, GetAdminProductsDto } from './dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  findAll(@Query() query: GetAdminProductsDto) {
    return this.productsService.findAllForAdmin(query);
  }

  @Get('products/categories')
  findCategories() {
    return this.productsService.findCategories();
  }

  @Put('products/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('products/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
