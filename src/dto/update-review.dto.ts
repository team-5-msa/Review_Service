import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  // performanceId는 자동으로 optional이 되지만, 수정 시 공연 ID는 변경할 수 없으므로
  // 실제로는 content와 rating만 수정 가능
}
