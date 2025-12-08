import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AppModel } from './entities/review.entity';
import { UserGuard } from './guards/user.guard';
import { GetUserId } from './decorators/get-user-id.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiCreateReview,
  ApiGetReviewsByPerformance,
  ApiUpdateReview,
  ApiDeleteReview,
  ApiGetMyReviews,
} from './decorators/swagger.decorator';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(UserGuard)
@UsePipes(new ValidationPipe())
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('my')
  @ApiGetMyReviews()
  getReviews(@GetUserId() userId: string) {
    return this.appService.getMyReviews(userId);
  }

  @Post()
  @ApiCreateReview()
  postReviews(
    @Body() createReviewDto: CreateReviewDto,
    @GetUserId() userId: string,
  ): Promise<AppModel> {
    return this.appService.createReview(
      createReviewDto.content,
      createReviewDto.rating,
      userId,
      createReviewDto.performanceId,
    );
  }

  @Get('performance/:performanceId')
  @ApiGetReviewsByPerformance()
  getPerformanceReviews(
    @Param('performanceId', ParseIntPipe) performanceId: number,
  ) {
    return this.appService.getReviewsByPerformance(performanceId);
  }

  @Patch(':id')
  @ApiUpdateReview()
  patchReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUserId() userId: string,
  ): Promise<AppModel> {
    if (!updateReviewDto.content || updateReviewDto.rating === undefined) {
      throw new BadRequestException('내용과 평점은 필수입니다.');
    }

    return this.appService.updateReview(
      id,
      userId,
      updateReviewDto.content,
      updateReviewDto.rating,
    );
  }

  @Delete(':id')
  @ApiDeleteReview()
  deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: string,
  ): Promise<{ message: string }> {
    return this.appService.deleteReview(id, userId);
  }
}
