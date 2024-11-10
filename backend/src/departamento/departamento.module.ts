import { Module } from '@nestjs/common';
import { DepartamentoController } from './departamento.controller';
import { DepartamentoService } from './departamento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './departamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Departamento])], 
  controllers: [DepartamentoController],
  providers: [DepartamentoService]
})
export class DepartamentoModule {}
