import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @Exclude()
  id: number;

  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  @ApiProperty({
    description: 'Description that provides more information about the user',
  })
  description: string | null;

  @ApiProperty({ description: 'Users job' })
  job: string | null;

  @ApiProperty({ description: 'Link to the users GitHub profile' })
  gitUrl: string | null;

  @ApiProperty({ description: 'Link to the users LinkedIn profile' })
  linkedinUrl: string | null;
}
