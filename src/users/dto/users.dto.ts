import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDto {
  @ApiProperty({ description: 'Unique identifier for the user', type: Number })
  @Exclude()
  id: number;

  @ApiProperty({ description: 'First name of the user', type: String })
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', type: String })
  lastName: string;

  @ApiProperty({ description: 'User email address', type: String })
  email?: string | null;

  @ApiProperty({
    description: 'Description that provides more information about the user',
    type: String,
    required: false,
  })
  description: string | null;

  @ApiProperty({ description: 'Users job', type: String, required: false })
  job: string | null;

  @ApiProperty({ description: 'Link to the users GitHub profile', type: String, required: false })
  gitUrl: string | null;

  @ApiProperty({ description: 'Link to the users LinkedIn profile', type: String, required: false })
  linkedinUrl: string | null;
}
