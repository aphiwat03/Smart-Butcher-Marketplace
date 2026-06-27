import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly supabaseService: SupabaseService,
  ) { }

  @Post('payments/upload-slip')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSlip(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body('orderId') orderId: string,
    @Body('amount') amount: string,
  ) {
    const userId = req.user.userId;
    let slipImageUrl: string | undefined = undefined;

    if (file) {
      const uploadedUrl = await this.supabaseService.uploadImage(file, 'products', 'slip');
      slipImageUrl = uploadedUrl ? uploadedUrl : undefined;
    }

    if (!slipImageUrl) {
      throw new BadRequestException('Image upload failed');
    }

    return this.paymentService.processSlipUpload(
      userId,
      Number(orderId),
      Number(amount),
      slipImageUrl,
    );
  }
}
