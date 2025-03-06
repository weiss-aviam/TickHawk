import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

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
    description: 'The number of hours spent on this reply',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  hours?: number;

  @ApiProperty({
    description: 'The files to attach to the reply',
    type: [String],
  })
  @IsArray()
  @ArrayMaxSize(3)
  @IsOptional()
  files: string[] = [];
}