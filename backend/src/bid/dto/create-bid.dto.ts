import { IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateBidDto {
  @IsUUID()
  jobId: string;

  @IsNumber()
  price: number; 

  @IsOptional()
  note?: string;

  @IsOptional()
  eta?: number;
}