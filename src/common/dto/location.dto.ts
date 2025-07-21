import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ description: 'Unique identifier for the language', type: Number })
  id: number;

  @ApiProperty({ description: 'Language', type: String })
  name: string;
}
