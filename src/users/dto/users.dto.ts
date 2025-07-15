import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @IsInt()
  @Exclude()
  id: number;

  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Description that provides more information about the user',
  })
  @IsOptional()
  description?: string | null;

  @ApiProperty({ description: 'Users job' })
  @IsOptional()
  job?: string | null;

  @ApiProperty({ description: 'Link to the users GitHub profile' })
  @IsOptional()
  gitUrl?: string | null;

  @ApiProperty({ description: 'Link to the users LinkedIn profile' })
  @IsOptional()
  linkedinUrl?: string | null;
}
