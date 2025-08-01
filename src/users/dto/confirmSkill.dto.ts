import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class ConfirmSkillDto {
  @ApiProperty({ description: 'The ID of the skill to confirm', type: Number })
  @IsInt()
  skillId: number;

  @ApiProperty({ description: 'The ID of the user receiving the skill confirmation', type: Number })
  @IsInt()
  receiverId: number;

  @ApiProperty({ description: 'The transaction hash for the skill confirmation', type: String })
  @IsString()
  txnHash: string;
}
