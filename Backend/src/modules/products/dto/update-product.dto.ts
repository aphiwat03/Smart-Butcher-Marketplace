import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
