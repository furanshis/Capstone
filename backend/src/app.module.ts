import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { ReporteAsistenciaModule } from './reporte_asistencia/reporte_asistencia.module';
import { ReporteAsistencia } from './reporte_asistencia/reporte_asistencia.entity';
import { ChatbotAdminModule } from './chatbot-admin/chatbot-admin.module';


@Module({
  imports: [ ConfigModule.forRoot({cache:true}), 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'peppy-gist-443202-b9:us-central1:my-project',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'capstone',
      entities: [Empleados, Asistencia, Supervisor, Departamento, ReporteAsistencia],
      
      synchronize: true,
      
    }),
    
    EmpleadosModule,
    AsistenciaModule,
    SupervisorModule,
    DepartamentoModule,
    AsistenciaModule,
    ReporteAsistenciaModule,
    ChatbotAdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
