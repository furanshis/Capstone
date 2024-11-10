import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadosModule } from './empleados/empleados.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { Empleados } from './empleados/empleados.entity';
import { Asistencia } from './asistencia/asistencia.entity';
import { SupervisorModule } from './supervisor/supervisor.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { Supervisor } from './supervisor/supervisor.entity';
import { Departamento } from './departamento/departamento.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'capstone',
      entities: [Empleados, Asistencia, Supervisor, Departamento],
      
      migrationsRun: true,
      
    }),
    EmpleadosModule,
    AsistenciaModule,
    SupervisorModule,
    DepartamentoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
