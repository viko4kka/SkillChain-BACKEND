import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class LanguageDto {
  @ApiProperty({ description: 'Unique identifier for the language', type: Number })
  @Exclude()
  id: number;

  @ApiProperty({ description: 'Language', type: String })
  name: string;
}
