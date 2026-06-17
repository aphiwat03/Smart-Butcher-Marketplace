import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อร้านค้า' })
  @MaxLength(50, { message: 'ชื่อร้านค้าต้องไม่เกิน 50 ตัวอักษร' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
