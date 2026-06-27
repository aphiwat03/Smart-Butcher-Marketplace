import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserAddressDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  receiverName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  addressLine?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
