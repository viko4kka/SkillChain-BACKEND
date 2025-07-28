import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    example: 'Project updated successfully',
    description: 'A human-readable message indicating the operation result',
  })
  message: string;
}
