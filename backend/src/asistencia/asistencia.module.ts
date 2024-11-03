import { Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './asistencia.entity';
import { Empleados } from 'src/empleados/empleados.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia, Empleados])],
  providers: [AsistenciaService],
  controllers: [AsistenciaController]
})
export class AsistenciaModule {}
