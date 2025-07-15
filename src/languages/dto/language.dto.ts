import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class LanguageDto {
  @ApiProperty({ description: 'Unique identifier for the language' })
  @Exclude()
  id: number;

  @ApiProperty({ description: 'Language' })
  name: string;

  @ApiProperty({ description: 'Users id' })
  userId: string;
}
