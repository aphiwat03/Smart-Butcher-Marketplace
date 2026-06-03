import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsFilterDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
