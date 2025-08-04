import { ApiProperty } from '@nestjs/swagger';
import { LanguageDto } from '../../common/dto/language.dto';

export class UserLanguageDto extends LanguageDto {
  @ApiProperty({ description: "Description of user's language skills", type: String })
  description: string | null;
}
