import { ApiProperty } from '@nestjs/swagger';

export class UserSkillWithConfirmations {
  @ApiProperty({ description: 'Skill ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Skill name', type: String })
  name: string;

  @ApiProperty({ description: 'User skill description', type: String })
  description: string;

  @ApiProperty({
    description: 'Array of confirmations with approver data',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        firstName: { type: 'string' },
        lastName: { type: 'string' }
      }
    }
  })
  confirmations: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
}