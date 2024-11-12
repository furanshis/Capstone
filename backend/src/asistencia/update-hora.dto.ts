import { IsString } from 'class-validator';

export class UpdateHoraDto {
  @IsString()
  hora: string;
}
