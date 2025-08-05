import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
export class GetUsersQueryDto {
  @ApiProperty({
    type: String,
    description: 'Search',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  search?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  skillId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  languageId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  locationId?: string;
}
