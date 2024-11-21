import { IsString, IsNotEmpty } from 'class-validator';

export class InitializeMessageDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}