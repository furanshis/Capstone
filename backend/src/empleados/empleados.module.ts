import { Module } from '@nestjs/common';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleados } from './empleados.entity';
import { Asistencia } from 'src/asistencia/asistencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleados, Asistencia])],
  controllers: [EmpleadosController],
  providers: [EmpleadosService]
})
export class EmpleadosModule {}
