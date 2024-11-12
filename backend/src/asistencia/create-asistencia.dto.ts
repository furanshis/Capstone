import { IsNotEmpty, IsDateString, IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAsistenciaDto {
  @IsOptional()
  @IsDateString()
  fecha_asistencia?: Date;

  @IsOptional()
  @IsString()
  hora_entrada?: string;

  @IsOptional()
  @IsString()
  hora_salida?: string;

  @IsOptional()
  @IsString()
  horas_trabajadas?: string;

  @IsOptional()
  @IsString()
  horas_extras?: string;

  @IsOptional()
  @IsString()
  geolocacion?: string;

  @IsOptional()
  @IsBoolean()
  validacion_biometrica?: boolean;

  @IsNotEmpty()
  @IsNumber()
  empleado_id: number;
}
