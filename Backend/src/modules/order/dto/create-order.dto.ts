import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsString()
  shippingName!: string;

  @IsNotEmpty()
  @IsString()
  shippingPhone!: string;

  @IsNotEmpty()
  @IsString()
  shippingAddressText!: string;
}
