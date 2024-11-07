import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleados } from './empleados.entity';

@Injectable()
export class EmpleadosService {

    constructor(
        @InjectRepository(Empleados)
        private empleadosRepository: Repository<Empleados>
    ){}

    // Crear un nuevo empleado
  async createEmpleado(data: Partial<Empleados>): Promise<Empleados> {
    const empleado = this.empleadosRepository.create(data);
    return this.empleadosRepository.save(empleado);
  }

  // Obtener un empleado por UID
  async getEmpleadoByUid(uid: string): Promise<Empleados | undefined> {
    return this.empleadosRepository.findOne({ where: { uid } });
  }

  // Obtener todos los empleados
  async getAllEmpleados(): Promise<Empleados[]> {
    return this.empleadosRepository.find();
  }

}



