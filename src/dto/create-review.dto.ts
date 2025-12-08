import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: '리뷰 내용',
    example: '정말 감동적인 공연이었습니다!',
  })
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '내용은 필수입니다.' })
  content: string;

  @ApiProperty({
    description: '평점 (1~5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber({}, { message: '평점은 숫자여야 합니다.' })
  @IsNotEmpty({ message: '평점은 필수입니다.' })
  @Min(1, { message: '평점은 최소 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5점 이하여야 합니다.' })
  rating: number;

  @ApiProperty({
    description: '공연 ID',
    example: 1,
  })
  @IsNumber({}, { message: '공연 ID는 숫자여야 합니다.' })
  @IsNotEmpty({ message: '공연 ID는 필수입니다.' })
  performanceId: number;
}
