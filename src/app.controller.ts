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
import { AppService } from './app.service';
import { UserGuard } from './guards/user.guard';
import { extractTokenFromRequest } from './utils/token.util';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

@Controller('reviews')
@UseGuards(UserGuard)
@UsePipes(new ValidationPipe())
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  postReviews(
    @Body() createReviewDto: CreateReviewDto,
    @Req() request: AuthenticatedRequest,
  ) {
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
  getPerformanceReviews(
    @Param('performanceId', ParseIntPipe) performanceId: number,
  ) {
    return this.appService.getReviewsByPerformance(performanceId);
  }

  @Patch(':id')
  patchReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.updateReview(
      id,
      userId,
      updateReviewDto.content,
      updateReviewDto.rating,
    );
  }

  @Delete(':id')
  deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.deleteReview(id, userId);
  }

  @Get('my')
  getReviews(@Req() request: AuthenticatedRequest) {
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('사용자 정보를 찾을 수 없습니다.');
    }

    return this.appService.getMyReviews(userId);
  }
}
