import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  categoryId!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
