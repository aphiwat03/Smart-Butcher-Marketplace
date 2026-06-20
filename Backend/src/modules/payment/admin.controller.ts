import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { AdminGuard } from './guards/admin.guard';
import { PaymentService } from './payment.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly paymentService: PaymentService) {}

  @Patch('payments/:id/verify')
  async verifyPayment(
    @Req() req: any,
    @Param('id') id: string,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPaymentSlip(
      Number(id),
      verifyPaymentDto.status,
    );
  }
}
