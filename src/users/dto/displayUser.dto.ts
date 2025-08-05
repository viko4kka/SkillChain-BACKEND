import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

type UserSkillType = {
  id: number;
  name: string;
};

type UserLanguageType = {
  id: number;
  name: string;
};

type UserLocationType = {
  id: number;
  name: string;
};

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
