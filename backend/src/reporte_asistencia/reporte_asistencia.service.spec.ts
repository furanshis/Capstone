import { Test, TestingModule } from '@nestjs/testing';
import { ReporteAsistenciaService } from './reporte_asistencia.service';

describe('ReporteAsistenciaService', () => {
  let service: ReporteAsistenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReporteAsistenciaService],
    }).compile();

    service = module.get<ReporteAsistenciaService>(ReporteAsistenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
