import { ApiProperty } from '@nestjs/swagger';
import { LanguageDto } from './language.dto';
import { Pagination } from 'src/utlis/dto/pagination.dto';

export class PaginatedLanguagesDto extends Pagination<LanguageDto[]> {
  @ApiProperty({
    type: () => [LanguageDto],
    description: 'Array of languases',
  })
  data: [LanguageDto];
}
