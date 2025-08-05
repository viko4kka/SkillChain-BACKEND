import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserLanguageDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string | null;
}
