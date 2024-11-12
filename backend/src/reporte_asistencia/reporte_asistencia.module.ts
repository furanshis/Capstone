import { Module } from '@nestjs/common';
import { ReporteAsistenciaController } from './reporte_asistencia.controller';
import { ReporteAsistenciaService } from './reporte_asistencia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteAsistencia } from './reporte_asistencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReporteAsistencia])],
  controllers: [ReporteAsistenciaController],
  providers: [ReporteAsistenciaService]
})
export class ReporteAsistenciaModule {}
