import { IsNumber, Min, IsNotEmpty } from 'class-validator';
export class AddToCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity!: number;
}
