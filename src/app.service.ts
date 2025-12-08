import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { AppModel } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(AppModel)
    private readonly appRepository: Repository<AppModel>,
  ) {}

  async getPerformance(performanceId: number, token: string) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Request headers:', headers);
      console.log('Token:', token);

      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.PERFORMANCE_SERVICE_URL}/performances/${performanceId}`,
          { headers },
        ),
      );
      console.log('Performance response:', response.data);

      return response.data;
    } catch (error) {
      console.error(
        'Performance Service Error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('공연 정보 조회에 실패했습니다.');
    }
  }

  // POST /reviews: 리뷰 작성 (로그인 필요)
  async createReview(
    content: string,
    rating: number,
    userId: string,
    performanceId: number,
    token: string,
  ) {
    const performance = await this.getPerformance(performanceId, token);
    if (!performance) {
      throw new BadRequestException('해당 공연 정보를 찾을 수 없습니다.');
    }

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
      throw new BadRequestException('리뷰를 찾을 수 없습니다.');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('자신의 리뷰만 수정할 수 있습니다.');
    }

    review.content = content;
    review.rating = rating;

    return await this.appRepository.save(review);
  }

  async deleteReview(id: number, userId: string) {
    const review = await this.appRepository.findOne({ where: { id } });

    if (!review) {
      throw new BadRequestException('리뷰를 찾을 수 없습니다.');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('자신의 리뷰만 삭제할 수 있습니다.');
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
