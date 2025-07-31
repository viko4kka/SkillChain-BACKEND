import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString } from 'class-validator';

export class SetAddressDto {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678' })
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty({ description: 'Signature for user authentication' })
  @IsString()
  signature: string;
}
