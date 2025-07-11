import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { JobType } from '../../../generated/prisma'; 

export class CreateJobDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  categoryId: string;

  @IsEnum(JobType)
  type: JobType;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  acceptPrice?: number;

  @IsOptional()
  @IsString()
  acceptUntil?: Date;
}