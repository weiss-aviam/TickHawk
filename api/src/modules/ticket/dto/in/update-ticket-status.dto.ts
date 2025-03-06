import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTicketStatusDto {
  @ApiProperty({
    description: 'The new status of the ticket',
    enum: ['open', 'in-progress', 'pending', 'resolved', 'closed'],
  })
  @IsNotEmpty()
  @IsEnum(['open', 'in-progress', 'pending', 'resolved', 'closed'])
  @IsString()
  status: string;
}