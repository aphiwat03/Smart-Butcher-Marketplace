import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserAddressDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  receiverName!: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @IsNotEmpty()
  @IsString()
  addressLine!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  postalCode!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
