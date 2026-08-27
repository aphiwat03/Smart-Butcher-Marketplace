import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ-นามสกุล' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty({ message: 'กรุณากรอกข้อความ' })
  @IsString()
  message: string;
}
