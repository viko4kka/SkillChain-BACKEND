import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserLanguageDto {
  @ApiProperty({ description: 'Unique identifier for the language', type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Description of user's language skills", type: String })
  @IsOptional()
  @IsString()
  description: string | null;
}
