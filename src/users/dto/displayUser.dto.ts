import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { SkillDto } from 'src/common/dto/skill.dto';
import { LanguageDto } from 'src/common/dto/language.dto';
import { LocationDto } from 'src/common/dto/location.dto';

type UserSkillType = SkillDto;

type UserLanguageType = LanguageDto;

type UserLocationType = LocationDto;

export class DisplayUserDto extends UserDto {
  @ApiProperty({
    description: 'Comma-separated list of user skills',
  })
  userSkills: UserSkillType[];

  @ApiProperty({
    description: 'Location Name of the user',
  })
  location: UserLocationType;

  @ApiProperty({
    description: 'Language Name of the user',
  })
  userLanguages: UserLanguageType[];
}
