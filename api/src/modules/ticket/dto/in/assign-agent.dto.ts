import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignAgentDto {
  @ApiProperty({
    description: 'The ID of the agent to assign to the ticket',
  })
  @IsNotEmpty()
  @IsString()
  agentId: string;
}