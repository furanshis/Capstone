import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReporteAsistencia } from './reporte_asistencia.entity';
import { Repository } from 'typeorm';
import { CreateReporteAsistenciaDto } from './crear-reporte-asistencia.dto';

@Injectable()
export class ReporteAsistenciaService {
    constructor(
        @InjectRepository(ReporteAsistencia)
        private reporteAsistenciaRepository: Repository<ReporteAsistencia>,
      ) {}
    
      async create(createReporteAsistenciaDto: CreateReporteAsistenciaDto): Promise<ReporteAsistencia> {
        const reporte = this.reporteAsistenciaRepository.create(createReporteAsistenciaDto);
        return this.reporteAsistenciaRepository.save(reporte);
      }
    
      async findAll(): Promise<ReporteAsistencia[]> {
        return this.reporteAsistenciaRepository.find({ relations: ['supervisor', 'asistencia'] });
      }
    
      async findById(id_reporte: number): Promise<ReporteAsistencia> {
        return this.reporteAsistenciaRepository.findOne({
          where: { id_reporte },
          relations: ['supervisor', 'asistencia'],
        });
      }
}
