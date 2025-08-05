import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { SkillDto } from 'src/common/dto/skill.dto';
import { LocationDto } from 'src/common/dto/location.dto';
import { LanguageDto } from 'src/common/dto/language.dto';

export class DisplayUserDto extends UserDto {
  @ApiProperty({
    description: 'Comma-separated list of user skills',
  })
  userSkills: SkillDto[];

  @ApiProperty({
    description: 'Location Name of the user',
  })
  location: LocationDto[];

  @ApiProperty({
    description: 'Language Name of the user',
  })
  userLanguages: LanguageDto[];
}
