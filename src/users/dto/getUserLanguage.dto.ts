import { ApiProperty } from '@nestjs/swagger';
import { LanguageDto } from '../../common/dto/language.dto';
import { IsOptional, IsString } from 'class-validator';

export class UserLanguageDto extends LanguageDto {
  @ApiProperty({ description: "Description of user's language skills", type: String })
  @IsOptional()
  @IsString()
  description: string | null;
}
