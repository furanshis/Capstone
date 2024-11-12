// src/reporte-asistencia/dto/create-reporte-asistencia.dto.ts

import { IsDate, IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateReporteAsistenciaDto {

    @IsNotEmpty()
  @IsInt()
  id_supervisor: number;

  @IsNotEmpty()
  @IsInt()
  id_asistencia: number;

  @IsNotEmpty()
  @IsDate()
  fecha_reporte: Date;

  @IsNumber()
  total_horas_trabajadas: number;

  @IsInt()
  numero_tardanzas: number;

  @IsInt()
  numero_ausencias: number;
}
