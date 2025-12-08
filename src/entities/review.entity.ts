import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Min, Max } from 'class-validator';

@Entity('reviews')
export class AppModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId?: string;

  @Column()
  performanceId: number;

  @Column()
  @Min(1, { message: '평점은 최소 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5점 이하여야 합니다.' })
  rating: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
