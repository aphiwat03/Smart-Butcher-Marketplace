import { IsEnum, IsOptional, IsString, IsIn } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class VerifyPaymentDto {
  @IsIn(['VERIFIED', 'REJECTED'])
  status!: 'VERIFIED' | 'REJECTED';

  @IsOptional()
  @IsString()
  adminNote?: string;
}
