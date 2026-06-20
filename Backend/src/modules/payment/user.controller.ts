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

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('payments/upload-slip')
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
