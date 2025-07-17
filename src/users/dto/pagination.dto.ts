import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
