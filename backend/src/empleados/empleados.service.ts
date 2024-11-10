import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
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
    console.log(uid)
    const empleado = await this.empleadosRepository.findOneBy({ uid });
    console.log(empleado)
    return empleado;
  }

  // Obtener todos los empleados
  async getAllEmpleados(): Promise<Empleados[]> {
    return this.empleadosRepository.find();
  }

}

