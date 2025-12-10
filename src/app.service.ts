import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { AppModel } from './entities/review.entity';
import { Repository } from 'typeorm';

interface PerformanceResponse {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(AppModel)
    private readonly appRepository: Repository<AppModel>,
  ) {}

  async getPerformance(
    performanceId: number,
    token?: string,
  ): Promise<PerformanceResponse> {
    try {
      const url = `${process.env.PERFORMANCE_SERVICE_API}/${performanceId}`;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await firstValueFrom(
        this.httpService.get<PerformanceResponse>(url, { headers }),
      );

      return response.data;
    } catch (error: any) {
      console.error('Performance API Error:', error.response?.data);

      // PerformanceService의 에러 응답 전달
      if (error.response?.status === 403) {
        throw new ForbiddenException(
          error.response?.data?.message || '공연에 접근할 권한이 없습니다.',
        );
      }

      if (error.response?.status === 404) {
        throw new NotFoundException('공연을 찾을 수 없습니다.');
      }

      // 기타 에러는 원본 메시지 전달
      throw new BadRequestException(
        error.response?.data?.message || '공연 정보 조회에 실패했습니다.',
      );
    }
  }

  async createReview(
    content: string,
    rating: number,
    userId: string,
    performanceId: number,
    token?: string,
  ) {
    // getPerformance는 exception을 throw하므로, 여기 도달하면 performance 존재
    const performance = await this.getPerformance(performanceId, token);

    console.log('performance', performance);

    const review = this.appRepository.create({
      content,
      rating,
      userId,
      performanceId,
    });

    return await this.appRepository.save(review);
  }

  async getReviewsByPerformance(performanceId: number) {
    return await this.appRepository.find({
      where: { performanceId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateReview(
    id: number,
    userId: string,
    content: string,
    rating: number,
  ) {
    const review = await this.appRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('자신의 리뷰만 수정할 수 있습니다.');
    }

    review.content = content;
    review.rating = rating;

    return await this.appRepository.save(review);
  }

  async deleteReview(id: number, userId: string) {
    const review = await this.appRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('자신의 리뷰만 삭제할 수 있습니다.');
    }

    await this.appRepository.remove(review);
    return { message: '리뷰가 삭제되었습니다.' };
  }

  async getMyReviews(userId: string) {
    return await this.appRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
