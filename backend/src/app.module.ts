import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadosModule } from './empleados/empleados.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { Empleados } from './empleados/empleados.entity';
import { Asistencia } from './asistencia/asistencia.entity';
import { SupervisorModule } from './supervisor/supervisor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'capstone',
      synchronize: true,
    }),
    Empleados,
    Asistencia,
    EmpleadosModule,
    AsistenciaModule,
    SupervisorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
