import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class LanguageDto {
  @ApiProperty({ description: 'Unique identifier for the language' })
  @IsInt()
  @Exclude()
  id: number;

  @ApiProperty({ description: 'Language' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Users id' })
  @IsInt()
  userId: string;
}
