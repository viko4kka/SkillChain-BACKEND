import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export class PaginationQueryFilter {
  @ApiProperty({
    description: 'Defines the number of projects to be displayed on each page.',
    minimum: 1,
    maximum: 50,
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  perPage: number = 10;

  @ApiProperty({
    description: 'Specifies the current page number being queried.',
    minimum: 1,
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}

export abstract class Pagination<T> {
  @ApiProperty({
    description: 'Array of data items for the current page.',
    isArray: true,
  })
  abstract data: T;

  @ApiProperty({ example: 1, description: 'Current page number.' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page.' })
  perPage: number;

  @ApiProperty({ example: 5, description: 'Total number of pages.' })
  maxPage: number;

  @ApiProperty({ example: 5, description: 'Total number of elements.' })
  itemsCount: number;
}
