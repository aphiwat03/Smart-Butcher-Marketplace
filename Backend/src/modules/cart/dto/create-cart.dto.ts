import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
export class AddToCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity!: number;
}
