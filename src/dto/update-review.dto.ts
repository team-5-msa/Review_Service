import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateReviewDto {
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '내용은 필수입니다.' })
  content: string;

  @IsNumber({}, { message: '평점은 숫자여야 합니다.' })
  @IsNotEmpty({ message: '평점은 필수입니다.' })
  @Min(1, { message: '평점은 최소 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5점 이하여야 합니다.' })
  rating: number;
}
