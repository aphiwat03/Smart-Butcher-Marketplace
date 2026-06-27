import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() dto: CreateReviewDto) {
    const userId = req.user.userId;
    return this.reviewService.create(userId, dto);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.findByProduct(productId);
  }
}
