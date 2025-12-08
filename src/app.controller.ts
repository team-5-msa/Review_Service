import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UsePipes,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AppModel } from './entities/review.entity';
import { UserGuard } from './guards/user.guard';
import { extractTokenFromRequest } from './utils/token.util';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiCreateReview,
  ApiGetReviewsByPerformance,
  ApiUpdateReview,
  ApiDeleteReview,
  ApiGetMyReviews,
} from './decorators/swagger.decorator';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(UserGuard)
@UsePipes(new ValidationPipe())
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('my')
  @ApiGetMyReviews()
  getReviews(@Req() request: AuthenticatedRequest) {
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.getMyReviews(userId);
  }

  @Post()
  @ApiCreateReview()
  postReviews(
    @Body() createReviewDto: CreateReviewDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<AppModel> {
    const token = extractTokenFromRequest(request);
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('사용자 정보를 찾을 수 없습니다.');
    }

    if (!token) {
      throw new BadRequestException('인증 토큰이 필요합니다.');
    }

    return this.appService.createReview(
      createReviewDto.content,
      createReviewDto.rating,
      userId,
      createReviewDto.performanceId,
      token,
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
    @Req() request: AuthenticatedRequest,
  ): Promise<AppModel> {
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('사용자 정보를 찾을 수 없습니다.');
    }

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
    @Req() request: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.deleteReview(id, userId);
  }
}
