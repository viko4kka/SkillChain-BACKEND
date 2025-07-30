import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class DisplayUserDto extends UserDto {
  @ApiProperty({
    description: 'Comma-separated list of user skills',
    type: String,
    required: false,
  })
    skills: string | null;
    
    @ApiProperty({
    description: 'Location Name of the user',
    type: String,
    required: false,
  })
    location: string | null;
}