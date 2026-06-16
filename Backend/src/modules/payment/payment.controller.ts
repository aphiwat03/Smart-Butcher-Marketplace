import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import 'multer';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-slip')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSlip(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('orderId') orderId: string,
    @Body('amount') amount: string,
  ) {
    const userId = req.user.userId;
    return this.paymentService.processSlipUpload(
      userId,
      Number(orderId),
      Number(amount),
    );
  }
}
