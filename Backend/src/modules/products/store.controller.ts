import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UploadedFile } from '@nestjs/common';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly supabaseService: SupabaseService,
  ) { }

  @Get('products/my-store')
  async findMyStoreProducts(@Req() req: any, @Query('page') page?: string) {
    const userId = req.user.userId;
    const pageNumber = parseInt(page || '1', 10);
    return this.productsService.findMyStoreProducts(userId, pageNumber, 8);
  }

  @Post('products')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
    @UploadedFile() file: any,
  ) {
    const userId = req.user.userId;
    let imageUrl: string | undefined = undefined;

    if (file) {
      const categoryName = await this.productsService.getCategoryNameById(createProductDto.categoryId);

      const mapToFolder = (name: string) => {
        const map: Record<string, string> = {
          'เนื้อสำหรับสเต็ก': 'steak',
          'เนื้อวากิวคัดพิเศษ': 'wagyu',
          'เนื้อดรายเอจ': 'dry-aged',
          'เนื้อบด': 'minced-meat',
          'อุปกรณ์และเครื่องเคียง': 'equipment',
          'เนื้อแปรรูป': 'processed-meat',
        };
        const folder = map[name] || 'others';
        return `shop-pic/${folder}`;
      };

      const folderName = mapToFolder(categoryName);
      const uploadedUrl = await this.supabaseService.uploadImage(file, 'products', folderName);
      imageUrl = uploadedUrl ? uploadedUrl : undefined;
    }

    return this.productsService.create(createProductDto, userId, imageUrl);
  }

  @Put('products/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
    @UploadedFile() file?: any,
  ) {
    let imageUrl: string | undefined = undefined;

    if (file) {
      const categoryId = updateProductDto.categoryId;
      const categoryName = categoryId ? await this.productsService.getCategoryNameById(Number(categoryId)) : 'others';

      const mapToFolder = (name: string) => {
        const map: Record<string, string> = {
          'เนื้อสำหรับสเต็ก': 'steak',
          'เนื้อวากิวคัดพิเศษ': 'wagyu',
          'เนื้อดรายเอจ': 'dry-aged',
          'เนื้อบด': 'minced-meat',
          'อุปกรณ์และเครื่องเคียง': 'essentials',
          'เนื้อแปรรูป': 'processed-meat',
        };
        const folder = map[name] || 'others';
        return `shop-pic/${folder}`;
      };

      const folderName = mapToFolder(categoryName);
      const uploadedUrl = await this.supabaseService.uploadImage(file, 'products', folderName);
      imageUrl = uploadedUrl ? uploadedUrl : undefined;

      if (imageUrl) {
        updateProductDto.imageUrl = imageUrl;
      }
    }

    if (updateProductDto.categoryId) updateProductDto.categoryId = Number(updateProductDto.categoryId);
    if (updateProductDto.price) updateProductDto.price = Number(updateProductDto.price);
    if (updateProductDto.stockQuantity) updateProductDto.stockQuantity = Number(updateProductDto.stockQuantity);

    return this.productsService.update(Number(id), updateProductDto);
  }

  @Delete('products/:id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}
