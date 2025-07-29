import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString } from 'class-validator';

export class SetAddressDto {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678' })
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty({ description: 'The description of the wallet address', required: false })
  @IsString()
  signature: string;
}
