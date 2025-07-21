import { ApiProperty } from '@nestjs/swagger';
import { SkillDto } from './skill.dto';
import { Pagination } from 'src/utlis/dto/pagination.dto';

export class PaginatedSkillsDto extends Pagination<SkillDto[]> {
  @ApiProperty({
    type: () => [SkillDto],
    description: 'Array of skills',
  })
  data: [SkillDto];
}
