import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ReporteAsistenciaService } from './reporte_asistencia.service';
import { ReporteAsistencia } from './reporte_asistencia.entity';
import { CreateReporteAsistenciaDto } from './crear-reporte-asistencia.dto';

@Controller('reporte-asistencia')
export class ReporteAsistenciaController {
    constructor(private readonly reporteAsistenciaService: ReporteAsistenciaService) {}

    @Post()
        create(@Body() createReporteAsistenciaDto: CreateReporteAsistenciaDto): Promise<ReporteAsistencia> {
        return this.reporteAsistenciaService.create(createReporteAsistenciaDto);
    }

    @Get()
    async findAll(): Promise<ReporteAsistencia[]> {
        return this.reporteAsistenciaService.getReporteConAsistenciaYEmpleado();
    }

    @Get(':id')
    async findById(@Param('id') id_reporte: number): Promise<ReporteAsistencia> {
        return this.reporteAsistenciaService.findById(id_reporte);
    }
}
