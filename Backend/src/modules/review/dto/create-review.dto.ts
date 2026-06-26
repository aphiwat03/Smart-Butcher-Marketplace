import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsInt()
  @Type(() => Number)
  productId!: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  orderId?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  point!: number;

  @IsString()
  @IsOptional()
  description?: string;
}
