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
import { UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get('products/my-store')
  async findMyStoreProducts(@Req() req: any, @Query('page') page?: string) {
    const userId = req.user.userId;
    const pageNumber = parseInt(page || '1', 10);
    return this.productsService.findMyStoreProducts(userId, pageNumber, 8);
  }

  @Post('products')
  @UseInterceptors(FilesInterceptor('files', 4))
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const userId = req.user.userId;
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const store = await this.productsService.getStoreByUserId(userId);
      const storeFolder = store ? `store_${store.id}` : `store_user_${userId}`;

      const categoryName = await this.productsService.getCategoryNameById(
        createProductDto.categoryId,
      );

      const mapToFolder = (name: string) => {
        const map: Record<string, string> = {
          เนื้อสำหรับสเต็ก: 'steak',
          เนื้อวากิวคัดพิเศษ: 'wagyu',
          เนื้อดรายเอจ: 'dry-aged',
          เนื้อบด: 'minced-meat',
          อุปกรณ์และเครื่องเคียง: 'essentials',
          เนื้อแปรรูป: 'processed-meat',
        };
        return map[name] || 'others';
      };

      const categoryFolder = mapToFolder(categoryName);
      const batchId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const targetFolder = `shop-pic/${categoryFolder}/${storeFolder}/${batchId}`;

      const uploadPromises = files.map((file, index) =>
        this.supabaseService.uploadImage(
          file,
          'products',
          targetFolder,
          `${index + 1}`,
        ),
      );

      const uploadedResults = await Promise.all(uploadPromises);
      imageUrls = uploadedResults.filter((url): url is string => !!url);
    }

    return this.productsService.create(createProductDto, userId, imageUrls);
  }

  @Put('products/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    let imageUrls: string | undefined = undefined;

    if (files) {
      const categoryId = updateProductDto.categoryId;
      const categoryName = categoryId
        ? await this.productsService.getCategoryNameById(Number(categoryId))
        : 'others';

      const mapToFolder = (name: string) => {
        const map: Record<string, string> = {
          เนื้อสำหรับสเต็ก: 'steak',
          เนื้อวากิวคัดพิเศษ: 'wagyu',
          เนื้อดรายเอจ: 'dry-aged',
          เนื้อบด: 'minced-meat',
          อุปกรณ์และเครื่องเคียง: 'essentials',
          เนื้อแปรรูป: 'processed-meat',
        };
        const folder = map[name] || 'others';
        return `shop-pic/${folder}`;
      };

      const folderName = mapToFolder(categoryName);
      const uploadedUrl = await this.supabaseService.uploadImage(
        files,
        'products',
        folderName,
      );
      imageUrls = uploadedUrl ? uploadedUrl : undefined;

      if (imageUrls) {
        updateProductDto.imageUrl = imageUrls;
      }
    }

    if (updateProductDto.categoryId)
      updateProductDto.categoryId = Number(updateProductDto.categoryId);
    if (updateProductDto.price)
      updateProductDto.price = Number(updateProductDto.price);
    if (updateProductDto.stockQuantity)
      updateProductDto.stockQuantity = Number(updateProductDto.stockQuantity);

    return this.productsService.update(Number(id), updateProductDto);
  }

  @Delete('products/:id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}
