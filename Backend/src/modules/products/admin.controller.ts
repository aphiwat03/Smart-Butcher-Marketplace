import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly productsService: ProductsService) {}

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
