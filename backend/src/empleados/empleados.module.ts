import { Module } from '@nestjs/common';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleados } from './empleados.entity';
import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Supervisor } from 'src/supervisor/supervisor.entity';
import { Departamento } from 'src/departamento/departamento.entity';
import { SupervisorService } from 'src/supervisor/supervisor.service';
import { SupervisorModule } from 'src/supervisor/supervisor.module';
import { DepartamentoModule } from 'src/departamento/departamento.module';

@Module({
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([Empleados ])],
=======
  imports: [TypeOrmModule.forFeature([Empleados])],
>>>>>>> ee24c6e4330ec15d12643a7ea69136a624d46a97
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  exports: [TypeOrmModule]
})
export class EmpleadosModule {}
