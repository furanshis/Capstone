import { Module } from '@nestjs/common';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleados } from './empleados.entity';
import { Asistencia } from '../asistencia/asistencia.entity';
import { Supervisor } from '../supervisor/supervisor.entity';
import { Departamento } from '../departamento/departamento.entity';
import { SupervisorService } from '../supervisor/supervisor.service';
import { SupervisorModule } from '../supervisor/supervisor.module';
import { DepartamentoModule } from '../departamento/departamento.module';

@Module({
  imports: [TypeOrmModule.forFeature([Empleados])],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  exports: [TypeOrmModule]
})
export class EmpleadosModule {}
