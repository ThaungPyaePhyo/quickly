import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { JobType, JobStatus } from '../../../generated/prisma';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  acceptPrice?: number;

  @IsOptional()
  scheduledAt?: Date;
}