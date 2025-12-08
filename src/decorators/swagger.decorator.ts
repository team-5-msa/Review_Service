import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

export function ApiCreateReview() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '리뷰 작성',
      description: '새로운 리뷰를 작성합니다.',
    }),
    ApiBody({
      type: CreateReviewDto,
    }),
    ApiResponse({
      status: 201,
      description: '리뷰 작성 성공',
      type: CreateReviewDto,
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 - 필수 필드 누락 또는 유효성 검사 실패',
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
  );
}

export function ApiGetReviewsByPerformance() {
  return applyDecorators(
    ApiOperation({
      summary: '공연별 리뷰 조회',
      description: '특정 공연의 모든 리뷰를 조회합니다.',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '리뷰 조회 성공',
      type: [CreateReviewDto],
    }),
    ApiResponse({
      status: 400,
      description: '유효하지 않은 공연 ID',
    }),
  );
}

export function ApiUpdateReview() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '리뷰 수정',
      description: '자신의 리뷰를 수정합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '리뷰 ID',
      example: 1,
    }),
    ApiBody({
      type: UpdateReviewDto,
    }),
    ApiResponse({
      status: 200,
      description: '리뷰 수정 성공',
      type: UpdateReviewDto,
    }),
    ApiResponse({
      status: 400,
      description: '유효하지 않은 요청 또는 권한 없음',
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
  );
}

export function ApiDeleteReview() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '리뷰 삭제',
      description: '자신의 리뷰를 삭제합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '리뷰 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '리뷰 삭제 성공',
    }),
    ApiResponse({
      status: 400,
      description: '리뷰를 찾을 수 없거나 권한 없음',
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
  );
}

export function ApiGetMyReviews() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '내 리뷰 조회',
      description: '로그인한 사용자가 작성한 모든 리뷰를 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '리뷰 조회 성공',
      type: [CreateReviewDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
  );
}
