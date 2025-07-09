import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  linkGit?: string;

  @ApiProperty({ required: false })
  linkLinkedIn?: string;
}