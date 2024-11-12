import { Test, TestingModule } from '@nestjs/testing';
import { ReporteAsistenciaController } from './reporte_asistencia.controller';

describe('ReporteAsistenciaController', () => {
  let controller: ReporteAsistenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReporteAsistenciaController],
    }).compile();

    controller = module.get<ReporteAsistenciaController>(ReporteAsistenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
