import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from './location.dto';
import { Pagination } from 'src/utlis/dto/pagination.dto';

export class PaginatedLocationsDto extends Pagination<LocationDto[]> {
  @ApiProperty({
    type: () => [LocationDto],
    description: 'Array of locations',
  })
  data: [LocationDto];
}
