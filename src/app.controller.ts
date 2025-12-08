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
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserGuard } from './guards/user.guard';
import { extractTokenFromRequest } from './utils/token.util';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
  };
}

@Controller('reviews')
@UseGuards(UserGuard)
@UsePipes(new ValidationPipe())
export class AppController {
  constructor(private readonly appService: AppService) {}

  //   - `POST /reviews`: 리뷰 작성 (로그인 필요)
  @Post()
  postReviews(
    @Body() createReviewDto: CreateReviewDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const token = extractTokenFromRequest(request);
    const userId = request.user?.user_id;

    if (!userId) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.createReview(
      createReviewDto.content,
      createReviewDto.rating,
      userId,
      createReviewDto.performanceId,
      token,
    );
  }

  // - `GET /reviews/performance/:performanceId`: 특정 공연의 리뷰 목록
  @Get('performance/:performanceId')
  getPerformanceReviews(
    @Param('performanceId', ParseIntPipe) performanceId: number,
  ) {
    return this.appService.getReviewsByPerformance(performanceId);
  }

  // - `PUT /reviews/:id`: 내 리뷰 수정
  @Patch(':id')
  patchReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.user_id;

    if (!userId) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.updateReview(
      id,
      userId,
      updateReviewDto.content,
      updateReviewDto.rating,
    );
  }

  // - `DELETE /reviews/:id`: 내 리뷰 삭제
  @Delete(':id')
  deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.user_id;

    if (!userId) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.deleteReview(id, userId);
  }

  // - `GET /reviews/my`: 내가 작성한 리뷰 목록
  @Get('my')
  getReviews(@Req() request: AuthenticatedRequest) {
    const userId = request.user?.user_id;

    if (!userId) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.getMyReviews(userId);
  }
}
