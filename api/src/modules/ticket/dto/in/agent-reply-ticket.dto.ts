import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AgentReplyTicketDto {
  @ApiProperty({
    description: 'The ticket ID',
  })
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty({
    description: 'The content of the reply',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @ApiProperty({
    description: 'The files to attach to the reply',
    type: [String],
  })
  @IsArray()
  @ArrayMaxSize(3)
  @IsOptional()
  files: string[] = [];
}